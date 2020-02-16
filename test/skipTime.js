const { time } = require("@openzeppelin/test-helpers");

contract("Skip Time", accounts => {
  before(async () => {
    const time1 = await web3.eth.getBlock("latest");
    console.log("start: ", time1.timestamp);

    //const days = .25; //14; // days
    const days = 14; // days
    const duration = days * 24 * 3600;
    await time.increase(duration);

    const time2 = await web3.eth.getBlock("latest");
    console.log("start: ", time2.timestamp);
  });

  it("time skips works", async () => {});
});
