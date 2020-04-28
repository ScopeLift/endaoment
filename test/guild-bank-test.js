require('dotenv').config();
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { time, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const GuildBank = contract.fromArtifact('GuildBank');
const { toWeiDai, stealDai, approveDai, daiBalance, cDaiBalance, dai2cDai } = require('./helpers');

const daiAddr = process.env.DAI_ADDR;
const cDaiAddr = process.env.CDAI_ADDR;
const deposit = new web3.utils.BN('2000');
const grant = new web3.utils.BN('1000');

const GrantDuration = 30*24*60*60;

describe('GuildBank', () => {
    const [ owner, grantee ] = accounts;

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

        await this.instance.deposit(toWeiDai(deposit), {from: owner});
        const afterBalance = await cDaiBalance(this.instance.address);

        expect(afterBalance.gt(initialBalance)).to.be.true;
    });

    it('should allow the owner to withdraw from the GuildBank', async () => {
        const initialBalance = await daiBalance(owner);
        await this.instance.withdraw(owner, 1, 1, {from: owner});

        const afterBalance = await daiBalance(owner);
        const balanceDiff = afterBalance.sub(initialBalance);

        expect(balanceDiff.gt(deposit)).to.be.true;
    });

    it('should allow the owner to deposit in the GuildBank again', async () => {
        const result = await this.instance.deposit(toWeiDai(deposit), {from: owner});
        expect(result.receipt.status).to.be.true;
        expectEvent(result.receipt, 'Deposit');
    });

    it('should allow the owner to initiate a stream', async () => {
        // Get the grant amount cDai
        const cDaiAmount = await dai2cDai(grant);

        // Calculate the divisible amount of cDai for stream
        const desiredAmount = new web3.utils.BN(cDaiAmount);
        const duration = new web3.utils.BN(GrantDuration);
        const remainder = desiredAmount.mod(duration);
        const divisibleAmount = desiredAmount.sub(remainder);

        // Calculate the start date start date
        const lastBlock = await web3.eth.getBlock('latest');
        const startDate = lastBlock.timestamp + 1000;

        // Initiate the stream
        const result = await this.instance.initiateStream(grantee, divisibleAmount, startDate, startDate + GrantDuration, {from: owner});

        expect(result.receipt.status).to.be.true;
    });

    // TODO: Get the stream id from an event emitted by GuildBank. Save it. Fast forward time and blocks.
    // Allow the grantee to withdraw from the stream. Confirm the GuildBank is paid interest when they do.
});