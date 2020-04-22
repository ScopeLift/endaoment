const { web3 } = require('@openzeppelin/test-environment');
const daiAbi = require('./dai.json').abi;

const daiFunder = process.env.DAI_FUNDER;
const daiAddress = process.env.DAI_ADDR;

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
}
