require('dotenv').config();
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
  const member1 = accounts[1];
  const signer = await ethersProvider.getSigner();
  const daiWeb3 = new web3.eth.Contract(daiAbi, daiAddress);
  const dai = new ethers.Contract(daiAddress, daiAbi, signer);

  console.log("Funding a few users with Dai...");
  await daiWeb3.methods
    .transfer(summoner, utils.parseEther("10000"))
    .send({ from: exchange });
  await daiWeb3.methods
    .transfer(member1, utils.parseEther("2500"))
    .send({ from: exchange });
  await daiWeb3.methods
    .transfer(accounts[2], utils.parseEther("12000"))
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
    "We’re responding to this crisis by doing what we’ve done for a decade: delivering cash. Each household will receive $1k, and we expect the main constraint on how many we can reach will be how much we can raise. We also plan to respond internationally, and are finalizing those details. Will share shortly. We’re beginning by targeting vulnerable households enrolled in SNAP, living in the areas hardest hit by COVID-19. This description was copied from the GiveDirectly Gitcoin grant at https://gitcoin.co/grants/561/givedirectly-covid-19-response.",
    overrides
  );
  await tx.wait();

  console.log("Getting address of the endaoment...");
  let endaoments = await factory.getEndaoments();
  console.log("  Address: ", endaoments[0]);

  // Add summoner as member with 3000 total shares shares and 3000 DAI
  console.log(
    "Submitting proposal to add summoner as member with more shares + Dai"
  );
  await dai.approve(endaoments[0], MAX_UINT);
  let endaoment = new ethers.Contract(endaoments[0], endaomentAbi, signer);
  await endaoment.submitProposal(summoner, utils.parseEther("3000"), "2999", "Add summoner shares and tribute");

  console.log("Submitting vote to pass proposal...");
  await time.increase(PERIOD_DURATION);
  await endaoment.submitVote('0', '1');

  console.log('Processing proposal...');
  await time.increase(VOTING_DURATION + GRACE_DURATION);
  await endaoment.processProposal('0', {gasLimit: 5e6});

  console.log("Submiting Proposal to add next member");
  await daiWeb3.methods.approve(endaoments[0], MAX_UINT).send({ from: member1 });
  await endaoment.submitProposal(member1, utils.parseEther("2500"), "2500", "Add Vitalik as member");

  console.log("Submitting vote to pass proposal...");
  await time.increase(PERIOD_DURATION);
  await endaoment.submitVote('1', '1');

  console.log('Processing proposal...');
  await time.increase(VOTING_DURATION + GRACE_DURATION);
  await endaoment.processProposal('1', {gasLimit: 5e6});

  console.log('Submitting grant proposal...');
  await endaoment.submitGrantProposal(
    '0x10F7Fc1F91Ba351f9C629c5947AD69bD03C05b96',
    "4688098560000", "2592000", "Grant To GiveDirectly");
  await time.increase(PERIOD_DURATION);


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
