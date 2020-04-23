require('dotenv').config();
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { time, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Moloch = contract.fromArtifact('Moloch');
const { toWeiDai, stealDai, approveDai } = require('./helpers');

const PERIOD_DURATION = 17280;
const VOTING_PERIODS = 35;
const GRACE_PERIODS = 35;
const ABORT_WINDOW = 5;
const VOTING_DURATION = VOTING_PERIODS * PERIOD_DURATION;
const GRACE_DURATION = GRACE_PERIODS * PERIOD_DURATION;

const GrantDuration = 30*24*60*60;

describe('Moloch', () => {
    const [ summoner, member1, member2, grantee1 ] = accounts;

    before(async () => {
        this.instance = await Moloch.new(
            summoner,
            process.env.DAI_ADDR, // address _approvedToken (DAI address)
            PERIOD_DURATION, // uint256 _periodDuration
            VOTING_PERIODS, // uint256 _votingPeriodLength -- 35 periods?
            GRACE_PERIODS, // uint256 _gracePeriodLength -- 35 periods?
            ABORT_WINDOW, // uint256 _abortWindow -- 5 periods?
            "100000000000000000000", // uint256 _proposalDeposit -- 100 Dai
            3, // uint256 _dilutionBound -- 3
            "1000000000000000000", // uint256 _processingReward -- 1 Dai
            "COVID-19 Relief",
            "Donate funds to selected organizations helping with COVID-19 relief",
            {from: summoner}
        );

        await stealDai(1000, summoner);
        await stealDai(20000, member1);
        await stealDai(20000, member2);
        await approveDai(summoner, this.instance.address);
        await approveDai(member1, this.instance.address);
        await approveDai(member2, this.instance.address);
    });

    it('should see the deployed Moloch contract', async () => {
        expect(this.instance.address.startsWith('0x')).to.be.true;
        expect(this.instance.address.length).to.equal(42);
    });

    it('should allow a membership proposal & vote', async () => {
        await this.instance.submitProposal(member1, toWeiDai(2000), 2000, "member1", {from: summoner});
        const proposal = await this.instance.proposalQueue(0);
        expect(proposal.details).to.equal("member1");

        await time.increase(PERIOD_DURATION);
        await this.instance.submitVote(0, 1, {from: summoner});
        await time.increase(VOTING_DURATION + GRACE_DURATION);
        await this.instance.processProposal(0, {from: summoner});

        const memberInfo = await this.instance.members(member1);
        expect(memberInfo.shares.toString()).to.equal('2000');
    });

    it('should allow another membership proposal & vote', async () => {
        await this.instance.submitProposal(member2, toWeiDai(3000), 3000, "member2", {from: member1});
        const proposal = await this.instance.proposalQueue(1);
        expect(proposal.details).to.equal("member2");

        await time.increase(PERIOD_DURATION);
        await this.instance.submitVote(1, 2, {from: summoner});
        await this.instance.submitVote(1, 1, {from: member1});
        await time.increase(VOTING_DURATION + GRACE_DURATION);
        await this.instance.processProposal(1, {from: summoner});

        const memberInfo = await this.instance.members(member2);
        expect(memberInfo.shares.toString()).to.equal('3000');
    });

    it('should not allow a grant proposal for more than guildbank owns', async () => {
        await expectRevert(
                this.instance.submitGrantProposal(grantee1, toWeiDai(10000),
                                        30*24*60*60, "grantee1", {from: member2}),
                "Endaoment::submitGrantProposal - grant is greater than treasury"
            );
    });

    it('should allow a grant proposal from the guildbank', async () => {
        const desiredAmount = new web3.utils.BN(toWeiDai(1000));
        const duration = new web3.utils.BN(GrantDuration);
        const remainder = desiredAmount.mod(duration);
        const divisibleAmount = desiredAmount.sub(remainder);

        await this.instance.submitGrantProposal(grantee1, divisibleAmount, GrantDuration, "grantee1", {from: member2});
        const proposal = await this.instance.proposalQueue(2);
        expect(proposal.details).to.equal('grantee1');
    });

    it('should allow memebers to vote on a grant proposal', async () => {
        await time.increase(PERIOD_DURATION);

        await this.instance.submitVote(2, 2, {from: member1});
        await this.instance.submitVote(2, 1, {from: member2});

        const proposal = await this.instance.proposalQueue(2);

        expect(proposal.yesVotes.toString()).to.equal('3000');
        expect(proposal.noVotes.toString()).to.equal('2000');
    });

    it('should process a successful grant proposal', async () => {
        await time.increase(VOTING_DURATION + GRACE_DURATION);

        await this.instance.processGrantProposal(2, {from: grantee1});
    });

    // TODO: Test proposal fails if ragequitters deplete required funds
});
