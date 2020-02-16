const { time } = require('@openzeppelin/test-helpers');

async function advanceBlockNumber(amount) {
  const currentBlock = await web3.eth.getBlockNumber();
  console.log('start block: ', currentBlock);

  for (let i = 0; i < amount; i += 1) {
    await time.advanceBlock()
  }

  const endBlock = await web3.eth.getBlockNumber();
  console.log('end block: ', endBlock);
}

contract("Skip Blocks", accounts => {
  before(async () => {
    await advanceBlockNumber(100)
  })

  it("skip blocks complete", async () => {})
})
