const { time } = require("@openzeppelin/test-helpers");
const CErc20 = artifacts.require("CErc20");
const cTokenAddress = "0xe982E462b094850F12AF94d21D470e21bE9D0E9C";
const { web3tx, toWad, wad4human } = require("@decentral.ee/web3-test-helpers");

let nBlocks = 100;
let cToken;

async function doBingeBorrowing(nBlocks = 100, accounts) {
  // this process should generate 0.0001% * nBlocks amount of tokens worth of interest
  // when nBlocks = 100, it is 0.001

  console.log(`Before binge borrowing: 1 cToken = ${wad4human(await cToken.exchangeRateStored.call())} Token`);
  // for testing purpose, our mock doesn't even check if there is
  // sufficient collateral in the system!!
  const borrowAmount = toWad(10);
  await web3tx(cToken.borrow, "cToken.borrow 10 to bingeBorrower", {
      inLogs: [{
          name: "Borrow"
      }]
  })(borrowAmount, {
      from: accounts[1]
  });
  console.log(`Wait for ${nBlocks} blocks...`);
  while(--nBlocks) await time.advanceBlock();
  await web3tx(cToken.accrueInterest, "cToken.accrueInterest")({ from: accounts[0] });
  console.log(`After binge borrowing: 1 cToken = ${wad4human(await cToken.exchangeRateStored.call())} Token`);
}

contract("Skip Time", accounts => {
  before(async () => {
    cToken = await CErc20.at(cTokenAddress);
    await doBingeBorrowing(nBlocks, accounts)
  });

  it("accrue interest works", async () => {});
});
