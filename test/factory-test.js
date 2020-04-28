const { accounts, contract } = require('@openzeppelin/test-environment');
const { expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Factory = contract.fromArtifact('EndaomentFactory');

describe('Endaoment Factory', () => {
    const [ summoner ] = accounts;

    before(async () => {
        this.factory = await Factory.new();
    });

    it('should see the deployed factory contract', async () => {
        expect(this.factory.address.startsWith('0x')).to.be.true;
        expect(this.factory.address.length).to.equal(42);
    });

    it('should deploy new endaoment contracts', async() => {
        const receipt = await this.factory.createEndaoment(
          summoner,
          "0x6B175474E89094C44Da98b954EedeAC495271d0F", // address _approvedToken (DAI address)
          17280, // uint256 _periodDuration
          35, // uint256 _votingPeriodLength -- 35 periods?
          35, // uint256 _gracePeriodLength -- 35 periods?
          5, // uint256 _abortWindow -- 5 periods?
          "100000000000000000000", // uint256 _proposalDeposit -- 100 Dai
          3, // uint256 _dilutionBound -- 3
          "1000000000000000000", // uint256 _processingReward -- 1 Dai
          "COVID-19 Relief",
          "Donate funds to selected organizations helping with COVID-19 relief",
          { from: summoner },
        );

        expectEvent(receipt, 'EndaomentCreated');
        const endaomentAddress = receipt.logs[0].args.endaoment;
        expect(endaomentAddress.startsWith('0x')).to.be.true;
        expect(endaomentAddress.length).to.equal(42);

        const endaoments = await this.factory.getEndaoments(); // array of all deployed endaoments
        expect(endaoments.length).to.equal(1);
        expect(endaoments[0]).to.equal(endaomentAddress)
    });
});
