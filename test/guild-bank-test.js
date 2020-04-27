require('dotenv').config();
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { time, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const GuildBank = contract.fromArtifact('GuildBank');
const { toWeiDai, stealDai, approveDai, daiBalance } = require('./helpers');

const daiAddr = process.env.DAI_ADDR;
const cDaiAddr = process.env.CDAI_ADDR;

describe('GuildBank', () => {
    const [ owner ] = accounts;

    before(async () => {
        this.instance = await GuildBank.new(
            daiAddr,
            cDaiAddr,
            {from: owner}
        );

        await stealDai(10000, owner);
        await approveDai(owner, this.instance.address);
    });

    it('should see the deployed GuildBank contract', async () => {
        expect(this.instance.address.startsWith('0x')).to.be.true;
        expect(this.instance.address.length).to.equal(42);

        const gbOwner = await this.instance.owner();
        const approvedToken = await this.instance.approvedToken();

        expect(gbOwner).to.equal(owner);
        expect(approvedToken).to.equal(daiAddr);
    });
});