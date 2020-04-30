const Web3 = require("web3");
const { time } = require("@openzeppelin/test-helpers");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const ethers = require("ethers");

const { constants, utils } = ethers;
const MAX_UINT = constants.MaxUint256.toString();

console.log("Setting up parameters...");
const factoryAddress = "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab";
const factoryBytecode = require("./build/contracts/EndaomentFactory.json")
  .bytecode;
const factoryAbi = require("./build/contracts/EndaomentFactory.json").abi;
const daiAbi = require("./abi/dai.json").abi;
const endaomentAbi = require("./build/contracts/Endaoment.json").abi;

const web3 = new Web3("http://localhost:8545");
const ethersProvider = new ethers.providers.JsonRpcProvider();

const daiAddress = process.env.DAI_ADDR;
const exchange = process.env.DAI_FUNDER;
const accounts = [
  "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1", // ganache account 0
  "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0", // ganache account 1
  "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b", // ganache account 2
];

const PERIOD_DURATION = 17280;
const VOTING_PERIODS = 35;
const GRACE_PERIODS = 35;
const ABORT_WINDOW = 5;
const VOTING_DURATION = VOTING_PERIODS * PERIOD_DURATION;
const GRACE_DURATION = GRACE_PERIODS * PERIOD_DURATION;

const GrantDuration = 30 * 24 * 60 * 60;

(async () => {
  console.log("Getting ethers.js signer...");
  const summoner = accounts[0];
  const signer = await ethersProvider.getSigner();
  const daiWeb3 = new web3.eth.Contract(daiAbi, daiAddress);
  const dai = new ethers.Contract(daiAddress, daiAbi, signer);

  console.log("Funding a few users with Dai...");
  await daiWeb3.methods
    .transfer(summoner, utils.parseEther("1000"))
    .send({ from: exchange });
  await daiWeb3.methods
    .transfer(accounts[1], utils.parseEther("250"))
    .send({ from: exchange });
  await daiWeb3.methods
    .transfer(accounts[2], utils.parseEther("1200"))
    .send({ from: exchange });

  // Deploy first endaoment and get its address
  console.log("Creating an endaoment...");
  const overrides = { gasLimit: 100000000 };
  const factory = new ethers.Contract(factoryAddress, factoryAbi, signer);
  let tx = await factory.createEndaoment(
    summoner,
    daiAddress,
    "17280",
    "35",
    "35",
    "5",
    "100000000000000000000",
    "3",
    "1000000000000000000",
    "COVID-19 Relief Funding",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut fermentum arcu. Maecenas rutrum turpis tortor. Donec consequat enim eros, at dictum nibh pellentesque sed. Sed nec dui ultrices, interdum erat nec, venenatis ante. Mauris erat nisi, blandit vel tristique a, aliquam vitae metus. Sed feugiat, sem sed venenatis tempor, nulla ex pulvinar justo, non tempor leo eros eget sapien. Praesent blandit mollis convallis. Aliquam erat volutpat. In hac habitasse platea dictumst. Quisque in ante lectus. Quisque nec ex a odio tristique feugiat nec consectetur sem. In et massa non nisl congue interdum. Integer varius consequat dui imperdiet tempor. Curabitur lacinia gravida metus, eget fermentum nisl laoreet mollis.",
    overrides
  );
  await tx.wait();

  console.log("Get address of the endaoment...");
  let endaoments = await factory.getEndaoments();
  console.log("  Address: ", endaoments[0]);

  // Add summoner as member with 300 total shares shares and 300 DAI
  console.log(
    "Submitting proposal to add summoner as member with more shares + Dai"
  );
  await dai.approve(endaoments[0], MAX_UINT);
  let endaoment = new ethers.Contract(endaoments[0], endaomentAbi, signer);
  await endaoment.submitProposal(summoner, utils.parseEther("0"), "0", "");

  console.log("Submitting vote to pass proposal...");
  await time.increase(PERIOD_DURATION);
  await endaoment.submitVote('0', '1');

  // console.log('Processing proposal...');
  // await time.increase(VOTING_DURATION + GRACE_DURATION);
  // await endaoment.processProposal('0');

  // Deploy next endaoment
  console.log("Create a second endaoment...");
  tx = await factory.createEndaoment(
    summoner,
    daiAddress,
    "17280",
    "35",
    "35",
    "5",
    "100000000000000000000",
    "3",
    "1000000000000000000",
    "Ganache Fork Development",
    "Ganache is a popular development tool which allows users to fork the mainnet. This is incredibly useful for developers, as it allows them to quickly stand up a realistic development environment in order to build off of any protocols deployed to the mainnet. This is much faster and easier then deploying local versions yourself. However, this feature is quite buggy, and the goal of this endaoment is to fund a developer to work on fixing existing issues with the ganache fork feature.",
    overrides
  );

  await tx.wait();

  // Send Dai to simulate funded DAOs
  endaoments = await factory.getEndaoments();
  endaoment = new ethers.Contract(endaoments[0], endaomentAbi, signer);
  await dai.transfer(await endaoment.guildBank(), utils.parseEther('300'));
  endaoment = new ethers.Contract(endaoments[1], endaomentAbi, signer);
  await dai.transfer(await endaoment.guildBank(), utils.parseEther('175'));

  console.log("Initialization complete!");
})();
