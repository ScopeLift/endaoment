pragma solidity ^0.5.0;

import "./Endaoment.sol";

contract EndaomentFactory {

  event EndaomentCreated(address indexed endaoment);

  constructor() public {}

  /**
   * @notice Deploy a new Endaoment
   * @dev Takes all the same inputs as the Endaoment constructor
   */
  function createEndaoment(
    // Moloch parameters
    address summoner,
    address _approvedToken,
    uint256 _periodDuration,
    uint256 _votingPeriodLength,
    uint256 _gracePeriodLength,
    uint256 _abortWindow,
    uint256 _proposalDeposit,
    uint256 _dilutionBound,
    uint256 _processingReward,
    // Endaoment specific parameters
    string calldata _name,
    string calldata _description
  ) external {

    Endaoment endaoment = new Endaoment(
      summoner,
      _approvedToken,
      _periodDuration,
      _votingPeriodLength,
      _gracePeriodLength,
      _abortWindow,
      _proposalDeposit,
      _dilutionBound,
      _processingReward,
      _name,
      _description
    );

    emit EndaomentCreated(address(endaoment));
  }
}