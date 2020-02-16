const { constants } = require('@openzeppelin/test-helpers');

const MAX_UINT256_STRING = constants.MAX_UINT256.toString();

const daiAbi = require("../abi/dai.json").abi;
const daiAddress = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa";
const rDaiAddress = "0x462303f77a3f17Dbd95eb7bab412FE4937F9B9CB";

const daiContract = new web3.eth.Contract(daiAbi, daiAddress);
const rDaiContract = new web3.eth.Contract(daiAbi, rDaiAddress);

const moloch = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601";



const daiHolder = "0x03ebd0748aa4d1457cf479cce56309641e0a98f5"; // person with a lot of Dai
const summoner = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"; // address 1
const member1 = "0xffcf8fdee72ac11b5c542428b35eef5769c409f0"; // 2
const member2 = "0x22d491bde2303f2f43325b2108d26f1eaba1e32b"; // 3

async function getDaiBalance(address) {
  return await daiContract.methods.balanceOf(address).call();
}

async function getRDaiBalance(address) {
  return await rDaiContract.methods.balanceOf(address).call();
}

contract("Balances", accounts => {
  before(async () => {

    console.log(await getDaiBalance(summoner));
    console.log(await getDaiBalance(member1));
    console.log(await getDaiBalance(member2));

    console.log(await getRDaiBalance("0x5d7d257d97d8a81f51187a77c6dd226fb8424d90"));

  })

  it("setup works", async () => {})
})


