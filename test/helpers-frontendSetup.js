const { accounts, contract } = require('@openzeppelin/test-environment');
const { expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Factory = contract.fromArtifact('EndaomentFactory');

describe('Endaoment Factory', () => {
    const [ summoner ] = accounts;

    before(async () => {
        this.factory = await Factory.new();
    });

    it('should deploy factory contract for the frontend', async () => {
        expect(this.factory.address.startsWith('0x')).to.be.true;
        expect(this.factory.address.length).to.equal(42);
        console.log('Factory Address: ', this.factory.address);
    });
});
