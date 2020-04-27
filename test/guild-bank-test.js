require('dotenv').config();
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { time, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const GuildBank = contract.fromArtifact('GuildBank');
const { toWeiDai, stealDai, approveDai, daiBalance, cDaiBalance } = require('./helpers');

const daiAddr = process.env.DAI_ADDR;
const cDaiAddr = process.env.CDAI_ADDR;
const firtDeposit = new web3.utils.BN('1000');

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

    it('should allow the owner to deposit to the GuildBank', async () => {
        const initialBalance = await cDaiBalance(this.instance.address);
        expect(initialBalance.toString()).to.equal('0');

        await this.instance.deposit(toWeiDai(firtDeposit), {from: owner});
        const afterBalance = await cDaiBalance(this.instance.address);

        expect(afterBalance.gt(initialBalance)).to.be.true;
    });

    it('should allow the owner to withdraw from the GuildBank', async () => {
        const initialBalance = await daiBalance(owner);
        await this.instance.withdraw(owner, 1, 1, {from: owner});

        const afterBalance = await daiBalance(owner);
        const balanceDiff = afterBalance.sub(initialBalance);

        expect(balanceDiff.gt(firtDeposit)).to.be.true;
    });
});