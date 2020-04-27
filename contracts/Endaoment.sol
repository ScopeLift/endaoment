pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "./GuildBank.sol";

contract Endaoment {
    using SafeMath for uint256;

    /***************
    GLOBAL CONSTANTS
    ***************/
    uint256 public periodDuration; // default = 17280 = 4.8 hours in seconds (5 periods per day)
    uint256 public votingPeriodLength; // default = 35 periods (7 days)
    uint256 public gracePeriodLength; // default = 35 periods (7 days)
    uint256 public abortWindow; // default = 5 periods (1 day)
    uint256 public proposalDeposit; // default = 10 ETH (~$1,000 worth of ETH at contract deployment)
    uint256 public dilutionBound; // default = 3 - maximum multiplier a YES voter will be obligated to pay in case of mass ragequit
    uint256 public processingReward; // default = 0.1 - amount of ETH to give to whoever processes a proposal
    uint256 public summoningTime; // needed to determine the current period

    IERC20 public approvedToken; // approved token contract reference; default = wETH
    GuildBank public guildBank; // guild bank contract reference

    // HARD-CODED LIMITS
    // These numbers are quite arbitrary; they are small enough to avoid overflows when doing calculations
    // with periods or shares, yet big enough to not limit reasonable use cases.
    uint256 constant MAX_VOTING_PERIOD_LENGTH = 10**18; // maximum length of voting period
    uint256 constant MAX_GRACE_PERIOD_LENGTH = 10**18; // maximum length of grace period
    uint256 constant MAX_DILUTION_BOUND = 10**18; // maximum dilution bound
    uint256 constant MAX_NUMBER_OF_SHARES = 10**18; // maximum number of shares that can be minted

    /***************
    EVENTS
    ***************/
    event SubmitProposal(uint256 proposalIndex, address indexed delegateKey, address indexed memberAddress, address indexed applicant, uint256 tokenTribute, uint256 sharesRequested);
    event SubmitGrantProposal(uint256 proposalIndex, address indexed delegateKey, address indexed memberAddress, address indexed applicant, uint256 tokenGrant, uint256 grantDuration);
    event SubmitRevocationProposal(uint256 proposalIndex, address indexed delegateKey, address indexed memberAddress, uint256 grantIndex);
    event SubmitVote(uint256 indexed proposalIndex, address indexed delegateKey, address indexed memberAddress, uint8 uintVote);
    event ProcessProposal(uint256 indexed proposalIndex, address indexed applicant, address indexed memberAddress, uint256 tokenTribute, uint256 sharesRequested, bool didPass);
    event ProcessGrantProposal(uint256 indexed proposalIndex, address indexed applicant, address indexed memberAddress, uint256 tokenGrant, uint256 grantDuration, bool didPass);
    event ProcessRevocationProposal(uint256 indexed proposalIndex, address indexed memberAddress, uint256 grantIndex, bool didPass);
    event Ragequit(address indexed memberAddress, uint256 sharesToBurn);
    event Abort(uint256 indexed proposalIndex, address applicantAddress);
    event UpdateDelegateKey(address indexed memberAddress, address newDelegateKey);
    event SummonComplete(address indexed summoner, uint256 shares);

    /******************
    INTERNAL ACCOUNTING
    ******************/
    uint256 public totalShares = 0; // total shares across all members
    uint256 public totalSharesRequested = 0; // total shares that have been requested in unprocessed proposals

    enum Vote {
        Null, // default value, counted as abstention
        Yes,
        No
    }

    enum ProposalKind {
        Membership,
        Grant,
        Revocation
    }

    struct Member {
        address delegateKey; // the key responsible for submitting proposals and voting - defaults to member address unless updated
        uint256 shares; // the # of shares assigned to this member
        bool exists; // always true once a member has been created
        uint256 highestIndexYesVote; // highest proposal index # on which the member voted YES
    }

    struct Grant {
        uint256 streamId; // Sablier Stream ID of the grant
        uint256 proposalIndex; // Position of this Grant in the proposal queue
        uint256 startDate; // When stream actually began
        uint256 endDate; // When stream will/did end
        bool wasRevoked;
    }

    struct Proposal {
        address proposer; // the member who submitted the proposal
        address applicant; // the applicant who wishes to become a member or receive a grant - this key will be used for withdrawals
        uint256 sharesRequested; // the # of shares the applicant is requesting
        uint256 startingPeriod; // the period in which voting can start for this proposal
        uint256 yesVotes; // the total number of YES votes for this proposal
        uint256 noVotes; // the total number of NO votes for this proposal
        bool processed; // true only if the proposal has been processed
        bool didPass; // true only if the proposal passed
        bool aborted; // true only if applicant calls "abort" fn before end of voting period
        uint256 tokenTribute; // amount of tokens offered as tribute or given as grant
        string details; // proposal details - could be IPFS hash, plaintext, or JSON
        uint256 maxTotalSharesAtYesVote; // the maximum # of total shares encountered at a yes vote on this proposal
        mapping (address => Vote) votesByMember; // the votes on this proposal by each member
        ProposalKind kind; // the kind of proposal
        uint256 grantMeta; // The grant duration for Grant proposals; the grant index for Revocation proposals
    }

    mapping (address => Member) public members;
    mapping (address => address) public memberAddressByDelegateKey;
    Proposal[] public proposalQueue;
    Grant[] public grants;

    /********
    MODIFIERS
    ********/
    modifier onlyMember {
        require(members[msg.sender].shares > 0, "Endaoment::onlyMember - not a member");
        _;
    }

    modifier onlyDelegate {
        require(members[memberAddressByDelegateKey[msg.sender]].shares > 0, "Endaoment::onlyDelegate - not a delegate");
        _;
    }

    /********
    FUNCTIONS
    ********/
    constructor(
        address summoner,
        address _approvedToken,
        uint256 _periodDuration,
        uint256 _votingPeriodLength,
        uint256 _gracePeriodLength,
        uint256 _abortWindow,
        uint256 _proposalDeposit,
        uint256 _dilutionBound,
        uint256 _processingReward,
        string memory _name,
        string memory _description
    ) public {
        require(summoner != address(0), "Endaoment::constructor - summoner cannot be 0");
        require(_approvedToken != address(0), "Endaoment::constructor - _approvedToken cannot be 0");
        require(_periodDuration > 0, "Endaoment::constructor - _periodDuration cannot be 0");
        require(_votingPeriodLength > 0, "Endaoment::constructor - _votingPeriodLength cannot be 0");
        require(_votingPeriodLength <= MAX_VOTING_PERIOD_LENGTH, "Endaoment::constructor - _votingPeriodLength exceeds limit");
        require(_gracePeriodLength <= MAX_GRACE_PERIOD_LENGTH, "Endaoment::constructor - _gracePeriodLength exceeds limit");
        require(_abortWindow > 0, "Endaoment::constructor - _abortWindow cannot be 0");
        require(_abortWindow <= _votingPeriodLength, "Endaoment::constructor - _abortWindow must be smaller than or equal to _votingPeriodLength");
        require(_dilutionBound > 0, "Endaoment::constructor - _dilutionBound cannot be 0");
        require(_dilutionBound <= MAX_DILUTION_BOUND, "Endaoment::constructor - _dilutionBound exceeds limit");
        require(_proposalDeposit >= _processingReward, "Endaoment::constructor - _proposalDeposit cannot be smaller than _processingReward");

        approvedToken = IERC20(_approvedToken);

        // Note: Trying to pass the cToken address into the Endaoment contructor results in
        // solc "Stack to deep" errors. Hardcoded cDai here for now.
        guildBank = new GuildBank(_approvedToken, 0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643);

        periodDuration = _periodDuration;
        votingPeriodLength = _votingPeriodLength;
        gracePeriodLength = _gracePeriodLength;
        abortWindow = _abortWindow;
        proposalDeposit = _proposalDeposit;
        dilutionBound = _dilutionBound;
        processingReward = _processingReward;

        summoningTime = now;

        members[summoner] = Member(summoner, 1, true, 0);
        memberAddressByDelegateKey[summoner] = summoner;
        totalShares = 1;

        emit SummonComplete(summoner, 1);
    }

    /*****************
    PROPOSAL FUNCTIONS
    *****************/

    function submitProposal(
        address applicant,
        uint256 tokenTribute,
        uint256 sharesRequested,
        string memory details
    )
        public
        onlyDelegate
    {
        require(applicant != address(0), "Endaoment::submitProposal - applicant cannot be 0");

        // Make sure we won't run into overflows when doing calculations with shares.
        // Note that totalShares + totalSharesRequested + sharesRequested is an upper bound
        // on the number of shares that can exist until this proposal has been processed.
        require(totalShares.add(totalSharesRequested).add(sharesRequested) <= MAX_NUMBER_OF_SHARES, "Endaoment::submitProposal - too many shares requested");

        totalSharesRequested = totalSharesRequested.add(sharesRequested);

        address memberAddress = memberAddressByDelegateKey[msg.sender];

        // collect proposal deposit from proposer and store it in the Endaoment until the proposal is processed
        require(approvedToken.transferFrom(msg.sender, address(this), proposalDeposit), "Endaoment::submitProposal - proposal deposit token transfer failed");

        // collect tribute from applicant and store it in the Endaoment until the proposal is processed
        require(approvedToken.transferFrom(applicant, address(this), tokenTribute), "Endaoment::submitProposal - tribute token transfer failed");

        // compute startingPeriod for proposal
        uint256 startingPeriod = max(
            getCurrentPeriod(),
            proposalQueue.length == 0 ? 0 : proposalQueue[proposalQueue.length.sub(1)].startingPeriod
        ).add(1);

        // create proposal ...
        Proposal memory proposal = Proposal({
            proposer: memberAddress,
            applicant: applicant,
            sharesRequested: sharesRequested,
            startingPeriod: startingPeriod,
            yesVotes: 0,
            noVotes: 0,
            processed: false,
            didPass: false,
            aborted: false,
            tokenTribute: tokenTribute,
            details: details,
            maxTotalSharesAtYesVote: 0,
            kind: ProposalKind.Membership,
            grantMeta: 0
        });

        // ... and append it to the queue
        proposalQueue.push(proposal);

        uint256 proposalIndex = proposalQueue.length.sub(1);
        emit SubmitProposal(proposalIndex, msg.sender, memberAddress, applicant, tokenTribute, sharesRequested);
    }

    //
    // when users may ragequit.
    // Call guildbank functions
    // Test proposals work and emit expected events
    // Integrate w/ Sablier and start a stream

    function submitGrantProposal(
        address applicant,
        uint256 tokenGrant,
        uint256 grantDuration,
        string memory details
    )
        public
        onlyDelegate
    {
        require(applicant != address(0), "Endaoment::submitProposal - applicant cannot be 0");
        require(tokenGrant <= approvedToken.balanceOf(address(guildBank)), "Endaoment::submitGrantProposal - grant is greater than treasury");

        address memberAddress = memberAddressByDelegateKey[msg.sender];

        // collect proposal deposit from proposer and store it in the Endaoment until the proposal is processed
        require(approvedToken.transferFrom(msg.sender, address(this), proposalDeposit), "Endaoment::submitProposal - proposal deposit token transfer failed");

        // compute startingPeriod for proposal
        uint256 startingPeriod = max(
            getCurrentPeriod(),
            proposalQueue.length == 0 ? 0 : proposalQueue[proposalQueue.length.sub(1)].startingPeriod
        ).add(1);

        // create proposal ...
        Proposal memory proposal = Proposal({
            proposer: memberAddress,
            applicant: applicant,
            sharesRequested: 0,
            startingPeriod: startingPeriod,
            yesVotes: 0,
            noVotes: 0,
            processed: false,
            didPass: false,
            aborted: false,
            tokenTribute: tokenGrant,
            details: details,
            maxTotalSharesAtYesVote: 0,
            kind: ProposalKind.Grant,
            grantMeta: grantDuration
        });

        // ... and append it to the queue
        proposalQueue.push(proposal);

        uint256 proposalIndex = proposalQueue.length.sub(1);
        emit SubmitGrantProposal(proposalIndex, msg.sender, memberAddress, applicant, tokenGrant, grantDuration);
    }

    function submitRevocationProposal(
        uint256 grantIndex,
        string memory details
    )
        public
        onlyDelegate
    {
        Grant storage grant = grants[grantIndex];

        uint256 proposalProcessDate = block.timestamp
                                            .add(periodDuration) // until voting starts
                                            .add(votingPeriodLength.mul(periodDuration)) // voting ends
                                            .add(gracePeriodLength.mul(periodDuration))  // grace end
                                            .add(periodDuration.mul(2)); // cushion

        // Ensure grant is not completed & exists at index (if index is invalid, endDate will be 0 & this fails)
        require(grant.endDate > proposalProcessDate, "Endaoment::submitRevocationProposal - grant distribution too close to completion");

        address memberAddress = memberAddressByDelegateKey[msg.sender];

        // collect proposal deposit from proposer and store it in the Endaoment until the proposal is processed
        require(approvedToken.transferFrom(msg.sender, address(this), proposalDeposit), "Endaoment::submitProposal - proposal deposit token transfer failed");

        // compute startingPeriod for proposal
        uint256 startingPeriod = max(
            getCurrentPeriod(),
            proposalQueue.length == 0 ? 0 : proposalQueue[proposalQueue.length.sub(1)].startingPeriod
        ).add(1);

        // create proposal ...
        Proposal memory proposal = Proposal({
            proposer: memberAddress,
            applicant: address(0),
            sharesRequested: 0,
            startingPeriod: startingPeriod,
            yesVotes: 0,
            noVotes: 0,
            processed: false,
            didPass: false,
            aborted: false,
            tokenTribute: 0,
            details: details,
            maxTotalSharesAtYesVote: 0,
            kind: ProposalKind.Revocation,
            grantMeta: grantIndex
        });

        // ... and append it to the queue
        proposalQueue.push(proposal);

        uint256 proposalIndex = proposalQueue.length.sub(1);
        emit SubmitRevocationProposal(proposalIndex, msg.sender, memberAddress, grantIndex);
    }

    function submitVote(uint256 proposalIndex, uint8 uintVote) public onlyDelegate {
        address memberAddress = memberAddressByDelegateKey[msg.sender];
        Member storage member = members[memberAddress];

        require(proposalIndex < proposalQueue.length, "Endaoment::submitVote - proposal does not exist");
        Proposal storage proposal = proposalQueue[proposalIndex];

        require(uintVote < 3, "Endaoment::submitVote - uintVote must be less than 3");
        Vote vote = Vote(uintVote);

        require(getCurrentPeriod() >= proposal.startingPeriod, "Endaoment::submitVote - voting period has not started");
        require(!hasVotingPeriodExpired(proposal.startingPeriod), "Endaoment::submitVote - proposal voting period has expired");
        require(proposal.votesByMember[memberAddress] == Vote.Null, "Endaoment::submitVote - member has already voted on this proposal");
        require(vote == Vote.Yes || vote == Vote.No, "Endaoment::submitVote - vote must be either Yes or No");
        require(!proposal.aborted, "Endaoment::submitVote - proposal has been aborted");

        // store vote
        proposal.votesByMember[memberAddress] = vote;

        // count vote
        if (vote == Vote.Yes) {
            proposal.yesVotes = proposal.yesVotes.add(member.shares);

            // set highest index (latest) yes vote - must be processed for member to ragequit
            if (proposalIndex > member.highestIndexYesVote) {
                member.highestIndexYesVote = proposalIndex;
            }

            // set maximum of total shares encountered at a yes vote - used to bound dilution for yes voters
            if (totalShares > proposal.maxTotalSharesAtYesVote) {
                proposal.maxTotalSharesAtYesVote = totalShares;
            }

        } else if (vote == Vote.No) {
            proposal.noVotes = proposal.noVotes.add(member.shares);
        }

        emit SubmitVote(proposalIndex, msg.sender, memberAddress, uintVote);
    }

    function processProposal(uint256 proposalIndex) public {
        require(proposalIndex < proposalQueue.length, "Endaoment::processProposal - proposal does not exist");
        Proposal storage proposal = proposalQueue[proposalIndex];

        require(getCurrentPeriod() >= proposal.startingPeriod.add(votingPeriodLength).add(gracePeriodLength), "Endaoment::processProposal - proposal is not ready to be processed");
        require(proposal.processed == false, "Endaoment::processProposal - proposal has already been processed");
        require(proposalIndex == 0 || proposalQueue[proposalIndex.sub(1)].processed, "Endaoment::processProposal - previous proposal must be processed");
        require(proposal.kind == ProposalKind.Membership, "Endaoment::processProposal - not a membership proposal");

        proposal.processed = true;
        totalSharesRequested = totalSharesRequested.sub(proposal.sharesRequested);

        bool didPass = proposal.yesVotes > proposal.noVotes;

        // Make the proposal fail if the dilutionBound is exceeded
        if (totalShares.mul(dilutionBound) < proposal.maxTotalSharesAtYesVote) {
            didPass = false;
        }

        // PROPOSAL PASSED
        if (didPass && !proposal.aborted) {

            proposal.didPass = true;

            // if the applicant is already a member, add to their existing shares
            if (members[proposal.applicant].exists) {
                members[proposal.applicant].shares = members[proposal.applicant].shares.add(proposal.sharesRequested);

            // the applicant is a new member, create a new record for them
            } else {
                // if the applicant address is already taken by a member's delegateKey, reset it to their member address
                if (members[memberAddressByDelegateKey[proposal.applicant]].exists) {
                    address memberToOverride = memberAddressByDelegateKey[proposal.applicant];
                    memberAddressByDelegateKey[memberToOverride] = memberToOverride;
                    members[memberToOverride].delegateKey = memberToOverride;
                }

                // use applicant address as delegateKey by default
                members[proposal.applicant] = Member(proposal.applicant, proposal.sharesRequested, true, 0);
                memberAddressByDelegateKey[proposal.applicant] = proposal.applicant;
            }

            // mint new shares
            totalShares = totalShares.add(proposal.sharesRequested);

            // transfer tokens to guild bank
            require(
                approvedToken.transfer(address(guildBank), proposal.tokenTribute),
                "Endaoment::processProposal - token transfer to guild bank failed"
            );

        // PROPOSAL FAILED OR ABORTED
        } else {
            // return all tokens to the applicant
            require(
                approvedToken.transfer(proposal.applicant, proposal.tokenTribute),
                "Endaoment::processProposal - failing vote token transfer failed"
            );
        }

        // send msg.sender the processingReward
        require(
            approvedToken.transfer(msg.sender, processingReward),
            "Endaoment::processProposal - failed to send processing reward to msg.sender"
        );

        // return deposit to proposer (subtract processing reward)
        require(
            approvedToken.transfer(proposal.proposer, proposalDeposit.sub(processingReward)),
            "Endaoment::processProposal - failed to return proposal deposit to proposer"
        );

        emit ProcessProposal(
            proposalIndex,
            proposal.applicant,
            proposal.proposer,
            proposal.tokenTribute,
            proposal.sharesRequested,
            didPass
        );
    }

    function processGrantProposal(uint256 proposalIndex) public {
        require(proposalIndex < proposalQueue.length, "Endaoment::processProposal - proposal does not exist");
        Proposal storage proposal = proposalQueue[proposalIndex];

        require(getCurrentPeriod() >= proposal.startingPeriod.add(votingPeriodLength).add(gracePeriodLength), "Endaoment::processProposal - proposal is not ready to be processed");
        require(proposal.processed == false, "Endaoment::processProposal - proposal has already been processed");
        require(proposalIndex == 0 || proposalQueue[proposalIndex.sub(1)].processed, "Endaoment::processProposal - previous proposal must be processed");
        require(proposal.kind == ProposalKind.Grant, "Endaoment::processGrantProposal - not a grant proposal");

        proposal.processed = true;

        bool didPass = proposal.yesVotes > proposal.noVotes;
        bool hasFunds = (proposal.tokenTribute < approvedToken.balanceOf(address(guildBank)));

        // PROPOSAL PASSED
        if (didPass && !proposal.aborted && hasFunds) {
            proposal.didPass = true;

            uint256 start = block.timestamp;
            uint256 end = block.timestamp.add(proposal.grantMeta);
            uint256 streamId = guildBank.initiateStream(proposal.applicant, proposal.tokenTribute,  start, end);

            Grant memory grant = Grant({
                streamId: streamId,
                proposalIndex: proposalIndex,
                startDate: start,
                endDate: end,
                wasRevoked: false
            });

            grants.push(grant);
        }

        // send msg.sender the processingReward
        require(
            approvedToken.transfer(msg.sender, processingReward),
            "Endaoment::processProposal - failed to send processing reward to msg.sender"
        );

        // return deposit to proposer (subtract processing reward)
        require(
            approvedToken.transfer(proposal.proposer, proposalDeposit.sub(processingReward)),
            "Endaoment::processProposal - failed to return proposal deposit to proposer"
        );

        emit ProcessGrantProposal(
            proposalIndex,
            proposal.applicant,
            proposal.proposer,
            proposal.tokenTribute,
            proposal.grantMeta,
            didPass
        );
    }

    function processRevocationProposal(uint256 proposalIndex) public {
        require(proposalIndex < proposalQueue.length, "Endaoment::processProposal - proposal does not exist");
        Proposal storage proposal = proposalQueue[proposalIndex];

        require(getCurrentPeriod() >= proposal.startingPeriod.add(votingPeriodLength).add(gracePeriodLength), "Endaoment::processProposal - proposal is not ready to be processed");
        require(proposal.processed == false, "Endaoment::processProposal - proposal has already been processed");
        require(proposalIndex == 0 || proposalQueue[proposalIndex.sub(1)].processed, "Endaoment::processProposal - previous proposal must be processed");
        require(proposal.kind == ProposalKind.Revocation, "Endaoment::processRevocationProposal - not a grant proposal");

        proposal.processed = true;

        bool didPass = proposal.yesVotes > proposal.noVotes;

        // PROPOSAL PASSED
        if (didPass && !proposal.aborted) {
            proposal.didPass = true;

            Grant storage grant = grants[proposal.grantMeta];
            grant.wasRevoked = true;

            guildBank.revokeStream(grant.streamId);
        }

        // send msg.sender the processingReward
        require(
            approvedToken.transfer(msg.sender, processingReward),
            "Endaoment::processProposal - failed to send processing reward to msg.sender"
        );

        // return deposit to proposer (subtract processing reward)
        require(
            approvedToken.transfer(proposal.proposer, proposalDeposit.sub(processingReward)),
            "Endaoment::processProposal - failed to return proposal deposit to proposer"
        );

        emit ProcessRevocationProposal(
            proposalIndex,
            proposal.proposer,
            proposal.grantMeta,
            didPass
        );
    }

    function ragequit(uint256 sharesToBurn) public onlyMember {
        uint256 initialTotalShares = totalShares;

        Member storage member = members[msg.sender];

        require(member.shares >= sharesToBurn, "Endaoment::ragequit - insufficient shares");

        require(canRagequit(member.highestIndexYesVote), "Endaoment::ragequit - cant ragequit until highest index proposal member voted YES on is processed");

        // burn shares
        member.shares = member.shares.sub(sharesToBurn);
        totalShares = totalShares.sub(sharesToBurn);

        // instruct guildBank to transfer fair share of tokens to the ragequitter
        require(
            guildBank.withdraw(msg.sender, sharesToBurn, initialTotalShares),
            "Endaoment::ragequit - withdrawal of tokens from guildBank failed"
        );

        emit Ragequit(msg.sender, sharesToBurn);
    }

    function abort(uint256 proposalIndex) public {
        require(proposalIndex < proposalQueue.length, "Endaoment::abort - proposal does not exist");
        Proposal storage proposal = proposalQueue[proposalIndex];

        require(msg.sender == proposal.applicant, "Endaoment::abort - msg.sender must be applicant");
        require(getCurrentPeriod() < proposal.startingPeriod.add(abortWindow), "Endaoment::abort - abort window must not have passed");
        require(!proposal.aborted, "Endaoment::abort - proposal must not have already been aborted");

        uint256 tokensToAbort = proposal.tokenTribute;
        proposal.tokenTribute = 0;
        proposal.aborted = true;

        // return all tokens to the applicant
        require(
            approvedToken.transfer(proposal.applicant, tokensToAbort),
            "Endaoment::processProposal - failed to return tribute to applicant"
        );

        emit Abort(proposalIndex, msg.sender);
    }

    function updateDelegateKey(address newDelegateKey) public onlyMember {
        require(newDelegateKey != address(0), "Endaoment::updateDelegateKey - newDelegateKey cannot be 0");

        // skip checks if member is setting the delegate key to their member address
        if (newDelegateKey != msg.sender) {
            require(!members[newDelegateKey].exists, "Endaoment::updateDelegateKey - cant overwrite existing members");
            require(!members[memberAddressByDelegateKey[newDelegateKey]].exists, "Endaoment::updateDelegateKey - cant overwrite existing delegate keys");
        }

        Member storage member = members[msg.sender];
        memberAddressByDelegateKey[member.delegateKey] = address(0);
        memberAddressByDelegateKey[newDelegateKey] = msg.sender;
        member.delegateKey = newDelegateKey;

        emit UpdateDelegateKey(msg.sender, newDelegateKey);
    }

    /***************
    GETTER FUNCTIONS
    ***************/

    function max(uint256 x, uint256 y) internal pure returns (uint256) {
        return x >= y ? x : y;
    }

    function getCurrentPeriod() public view returns (uint256) {
        return now.sub(summoningTime).div(periodDuration);
    }

    function getProposalQueueLength() public view returns (uint256) {
        return proposalQueue.length;
    }

    // can only ragequit if the latest proposal you voted YES on has been processed
    function canRagequit(uint256 highestIndexYesVote) public view returns (bool) {
        require(highestIndexYesVote < proposalQueue.length, "Endaoment::canRagequit - proposal does not exist");
        return proposalQueue[highestIndexYesVote].processed;
    }

    function hasVotingPeriodExpired(uint256 startingPeriod) public view returns (bool) {
        return getCurrentPeriod() >= startingPeriod.add(votingPeriodLength);
    }

    function getMemberProposalVote(address memberAddress, uint256 proposalIndex) public view returns (Vote) {
        require(members[memberAddress].exists, "Endaoment::getMemberProposalVote - member doesn't exist");
        require(proposalIndex < proposalQueue.length, "Endaoment::getMemberProposalVote - proposal doesn't exist");
        return proposalQueue[proposalIndex].votesByMember[memberAddress];
    }
}