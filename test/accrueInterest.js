const { time } = require("@openzeppelin/test-helpers");
const CErc20 = artifacts.require("CErc20");
const cTokenAddress = "0xe982E462b094850F12AF94d21D470e21bE9D0E9C";
const { web3tx } = require("@decentral.ee/web3-test-helpers");

let nBlocks = 100;

contract("Skip Time", accounts => {
  before(async () => {

    const cToken = await CErc20.at(cTokenAddress);

    console.log(`Wait for ${nBlocks} blocks...`);
    while (--nBlocks) await time.advanceBlock();
    await web3tx(cToken.accrueInterest, "cToken.accrueInterest" )({ from: accounts[0] });
  });

  it("accrue interest works", async () => {});
});
