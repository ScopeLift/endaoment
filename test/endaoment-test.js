const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');
const Moloch = contract.fromArtifact('Moloch');

describe('Moloch', () => {
    const [ summoner ] = accounts;

    before(async () => {
        this.instance = await Moloch.new(
            summoner,
            "0x6B175474E89094C44Da98b954EedeAC495271d0F", // address _approvedToken (DAI address)
            17280, // uint256 _periodDuration
            35, // uint256 _votingPeriodLength -- 35 periods?
            35, // uint256 _gracePeriodLength -- 35 periods?
            5, // uint256 _abortWindow -- 5 periods?
            "100000000000000000000", // uint256 _proposalDeposit -- 100 Dai
            3, // uint256 _dilutionBound -- 3
            "1000000000000000000", // uint256 _processingReward -- 1 Dai
            {from: summoner});
    });

    it('should see the deployed Moloch contract', async () => {
        expect(this.instance.address.startsWith('0x')).to.be.true;
        expect(this.instance.address.length).to.equal(42);
    });
});
