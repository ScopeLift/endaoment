const HDWalletProvider = require('@truffle/hdwallet-provider');
const ethers = require('ethers')

const factoryAddress = '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab'
const factoryAbi = require('./build/contracts/EndaomentFactory.json').abi
const factoryBytecode = require('./build/contracts/EndaomentFactory.json').bytecode
const endaomentAbi = require('./build/contracts/Endaoment.json').abi

const ethersProvider = new ethers.providers.JsonRpcProvider();

const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const accounts = [
  '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', // ganache account 0
];


(async ()=>{
  // Get signer
  const signer = await ethersProvider.getSigner();

  // Define transaction parameters
  const overrides = { gasLimit: 100000000 };

  // Deploy first endaoment and get its address
  const factory = new ethers.Contract(factoryAddress, factoryAbi, signer);
  let tx = await factory.createEndaoment(
    accounts[0],
    daiAddress,
    '17280',
    '35',
    '35',
    '5',
    '100000000000000000000',
    '3',
    '1000000000000000000',
    'COVID-19 Relief Funding',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut fermentum arcu. Maecenas rutrum turpis tortor. Donec consequat enim eros, at dictum nibh pellentesque sed. Sed nec dui ultrices, interdum erat nec, venenatis ante. Mauris erat nisi, blandit vel tristique a, aliquam vitae metus. Sed feugiat, sem sed venenatis tempor, nulla ex pulvinar justo, non tempor leo eros eget sapien. Praesent blandit mollis convallis. Aliquam erat volutpat. In hac habitasse platea dictumst. Quisque in ante lectus. Quisque nec ex a odio tristique feugiat nec consectetur sem. In et massa non nisl congue interdum. Integer varius consequat dui imperdiet tempor. Curabitur lacinia gravida metus, eget fermentum nisl laoreet mollis.',
    overrides,
  );

  await tx.wait();

  const receipt = await ethersProvider.getTransactionReceipt(tx.hash);
  const logs = receipt.logs.map(rawLog => factory.interface.parseLog(rawLog));
  const validLogs = logs.filter(log => log !== null);
  const newEndaomentAddress = validLogs[0].values.endaoment;

  // // Connect to endaoment and create some proposals
  // const endaoment = new ethers.Contract(newEndaomentAddress, endaomentAbi, signer)
  // let tx = await endaoment.submitGrantProposal(
  //   // '0xc7464dbcA260A8faF033460622B23467Df5AEA42', // GiveDirectly
  // )

  // Deploy next endaoment
  tx = await factory.createEndaoment(
    accounts[0],
    daiAddress,
    '17280',
    '35',
    '35',
    '5',
    '100000000000000000000',
    '3',
    '1000000000000000000',
    'Ganache Fork Development',
    'Ganache is a popular development tool which allows users to fork the mainnet. This is incredibly useful for developers, as it allows them to quickly stand up a realistic development environment in order to build off of any protocols deployed to the mainnet. This is much faster and easier then deploying local versions yourself. However, this feature is quite buggy, and the goal of this endaoment is to fund a developer to work on fixing existing issues with the ganache fork feature.',
    overrides,
  );

  await tx.wait();
})();
