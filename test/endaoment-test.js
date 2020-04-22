require('dotenv').config();
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { expect } = require('chai');
const Moloch = contract.fromArtifact('Moloch');
const { toWeiDai, stealDai, approveDai } = require('./helpers');

describe('Moloch', () => {
    const [ summoner, member1 ] = accounts;

    before(async () => {
        this.instance = await Moloch.new(
            summoner,
           process.env.DAI_ADDR, // address _approvedToken (DAI address)
            17280, // uint256 _periodDuration
            35, // uint256 _votingPeriodLength -- 35 periods?
            35, // uint256 _gracePeriodLength -- 35 periods?
            5, // uint256 _abortWindow -- 5 periods?
            "100000000000000000000", // uint256 _proposalDeposit -- 100 Dai
            3, // uint256 _dilutionBound -- 3
            "1000000000000000000", // uint256 _processingReward -- 1 Dai
            "COVID-19 Relief",
            "Donate funds to selected organizations helping with COVID-19 relief",
            {from: summoner}
        );

        await stealDai(100, summoner);
        await stealDai(200, member1);
        await approveDai(summoner, this.instance.address);
        await approveDai(member1, this.instance.address);
    });

    it('should see the deployed Moloch contract', async () => {
        expect(this.instance.address.startsWith('0x')).to.be.true;
        expect(this.instance.address.length).to.equal(42);
    });

    it('should allow a membership proposal', async () => {
        await this.instance.submitProposal(member1, toWeiDai(200), 200, "member1", {from: summoner});
        const proposal = await this.instance.proposalQueue(0);
        expect(proposal.details).to.equal("member1");
    });
});
