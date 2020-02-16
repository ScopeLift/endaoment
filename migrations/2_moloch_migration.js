//const GuildBank = artifacts.require("GuildBank");
//const MolochPool = artifacts.require("MolochPool");
const Moloch = artifacts.require("Moloch");


module.exports = function(deployer) {
    // deployer.deploy(
    //       Moloch,
    //       "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1", // address summoner (address 1 of deterministic ganache)
    //       "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa", // address _approvedToken (DAI address)
    //       17280, // uint256 _periodDuration
    //       35, // uint256 _votingPeriodLength -- 35 periods?
    //       35, // uint256 _gracePeriodLength -- 35 periods?
    //       5, // uint256 _abortWindow -- 5 periods?
    //       "100000000000000000000", // uint256 _proposalDeposit -- 100 Dai
    //       3, // uint256 _dilutionBound -- 3
    //       "1000000000000000000" // uint256 _processingReward -- 1 Dai
    //     )
};
