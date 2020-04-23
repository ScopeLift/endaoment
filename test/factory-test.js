const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');
const Factory = contract.fromArtifact('EndaomentFactory');

describe('Endaoment Factory', () => {
    const [ summoner ] = accounts;

    before(async () => {
        this.factory = await Factory.new({ from: summoner });
    });

    it('should see the deployed factory contract', async () => {
        expect(this.factory.address.startsWith('0x')).to.be.true;
        expect(this.factory.address.length).to.equal(42);
    });
});
