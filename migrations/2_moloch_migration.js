//const GuildBank = artifacts.require("GuildBank");
//const MolochPool = artifacts.require("MolochPool");
const Moloch = artifacts.require("Moloch");


module.exports = function(deployer) {
    deployer.deploy(
          Moloch,
          "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1", // address summoner (address 1 of deterministic ganache)
          "0x6B175474E89094C44Da98b954EedeAC495271d0F", // address _approvedToken (DAI address)
          17280, // uint256 _periodDuration
          35, // uint256 _votingPeriodLength -- 35 periods?
          35, // uint256 _gracePeriodLength -- 35 periods?
          5, // uint256 _abortWindow -- 5 periods?
          100, // uint256 _proposalDeposit -- 100?
          3, // uint256 _dilutionBound -- 3
          1 // uint256 _processingReward -- 1?
        ) 
};
