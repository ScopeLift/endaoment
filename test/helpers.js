const { web3 } = require('@openzeppelin/test-environment');
const daiAbi = require('../abi/dai.json').abi;
const cDaiAbi = require('../abi/cdai.json').abi;

const daiFunder = process.env.DAI_FUNDER;
const daiAddress = process.env.DAI_ADDR;
const cDaiAddress = process.env.CDAI_ADDR;

exports.toWeiDai = (dai) => {
    return web3.utils.toWei(dai.toString(), 'ether');
};

exports.stealDai = async (amount, receiver) => {
    const daiContract = new web3.eth.Contract(daiAbi, daiAddress);
    await daiContract.methods.transfer(receiver, this.toWeiDai(amount)).send({from: daiFunder});
};

exports.approveDai = async (holder, spender) => {
    const daiContract = new web3.eth.Contract(daiAbi, daiAddress);
    await daiContract.methods.approve(spender, this.toWeiDai(1000000000000)).send({from: holder});
};

exports.daiBalance = async(holder) => {
    const daiContract = new web3.eth.Contract(daiAbi, daiAddress);
    const stringBalance = await daiContract.methods.balanceOf(holder).call();
    return new web3.utils.BN(stringBalance);
};

exports.cDaiBalance = async(holder) => {
    const cDaiContract = new web3.eth.Contract(cDaiAbi, cDaiAddress);
    const stringBalance = await cDaiContract.methods.balanceOf(holder).call();
    return new web3.utils.BN(stringBalance);
};
