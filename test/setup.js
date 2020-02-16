const { constants } = require('@openzeppelin/test-helpers');

const MAX_UINT256_STRING = constants.MAX_UINT256.toString();

const daiAbi = require("../abi/dai.json").abi;
const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

const daiContract = new web3.eth.Contract(daiAbi, daiAddress);

const moloch = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";



const daiHolder = "0x3a9f7c8ca36c42d7035e87c3304ee5cbd353a532"; // person with a lot of Dai
const summoner = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"; // address 1
const member1 = "0xffcf8fdee72ac11b5c542428b35eef5769c409f0"; // 2
const member2 = "0x22d491bde2303f2f43325b2108d26f1eaba1e32b"; // 3

async function sendDai(from, to, amount) {
  await daiContract.methods.transfer(to, amount).send({ from: from });
}

async function getDaiBalance(address) {
  return await daiContract.methods.balanceOf(address).call();
}

contract.skip("Setup", accounts => {
  before(async () => {
    // Initialize accounts with Dai
    await sendDai(daiHolder, summoner, web3.utils.toWei("10000", "ether"));
    await sendDai(daiHolder, member1, web3.utils.toWei("50000", "ether"));
    await sendDai(daiHolder, member2, web3.utils.toWei("100000", "ether"));

    // Give account approvals
    const amount = MAX_UINT256_STRING
    await daiContract.methods.approve(moloch, amount).send({from: summoner});
    await daiContract.methods.approve(moloch, amount).send({from: member1});
    await daiContract.methods.approve(moloch, amount).send({from: member2});

  })

  it("setup works", async () => {})
})


