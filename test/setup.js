const { constants } = require('@openzeppelin/test-helpers');

const MAX_UINT256_STRING = constants.MAX_UINT256.toString();

const daiAbi = require("../abi/dai.json").abi;
const daiAddress = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa";

const daiContract = new web3.eth.Contract(daiAbi, daiAddress);

const moloch = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";



const daiHolder = "0x03ebd0748aa4d1457cf479cce56309641e0a98f5"; // person with a lot of Dai
const summoner = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"; // address 1
const member1 = "0xffcf8fdee72ac11b5c542428b35eef5769c409f0"; // 2
const member2 = "0x22d491bde2303f2f43325b2108d26f1eaba1e32b"; // 3

async function sendDai(from, to, amount) {
  await daiContract.methods.transfer(to, amount).send({ from: from });
}

async function getDaiBalance(address) {
  return await daiContract.methods.balanceOf(address).call();
}

contract("Setup", accounts => {
  before(async () => {
    // Initialize accounts with Dai
    await sendDai(daiHolder, summoner, web3.utils.toWei("10000", "ether"));
    await sendDai(daiHolder, member1, web3.utils.toWei("15000", "ether"));
    await sendDai(daiHolder, member2, web3.utils.toWei("20000", "ether"));

    // Give account approvals
    const amount = MAX_UINT256_STRING
    await daiContract.methods.approve(moloch, amount).send({from: summoner});
    await daiContract.methods.approve(moloch, amount).send({from: member1});
    await daiContract.methods.approve(moloch, amount).send({from: member2});

  })

  it("setup works", async () => {})
})


