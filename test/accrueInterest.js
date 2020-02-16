const { time } = require("@openzeppelin/test-helpers");
const CErc20 = artifacts.require("CErc20");
const cTokenAddress = "0xe982E462b094850F12AF94d21D470e21bE9D0E9C";
const { web3tx, toWad, wad4human } = require("@decentral.ee/web3-test-helpers");

let nBlocks = 100;
let cToken;

async function doBingeBorrowing(nBlocks = 100, account) {
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
      from: account
  });
  await waitForInterest(nBlocks);
  console.log(`After binge borrowing: 1 cToken = ${wad4human(await cToken.exchangeRateStored.call())} Token`);
}

async function waitForInterest(nBlocks = 100) {
  console.log(`Wait for ${nBlocks} blocks...`);
  while(--nBlocks) await time.advanceBlock();
  await web3tx(cToken.accrueInterest, "cToken.accrueInterest")({ from: admin });
}

contract("Skip Time", accounts => {
  before(async () => {
    cToken = await CErc20.at(cTokenAddress);
    await doBingeBorrowing(nBlocks, accounts[1])
  });

  it("accrue interest works", async () => {});
});
