pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "./IRTokenOurs.sol";

contract GuildBank is Ownable {
    using SafeMath for uint256;

    IERC20 public approvedToken; // approved token contract reference
    IRTokenOurs public rToken;

    event Withdrawal(address indexed receiver, uint256 amount);

    constructor(address approvedTokenAddress, address _rTokenAddress) public {
        // TODO -- pass rToken address as a constructor arguemet
        // and lookup token() value to get approvedTokenAddress
        approvedToken = IERC20(approvedTokenAddress);
        Ownable.initialize(msg.sender);

        rToken = IRTokenOurs(_rTokenAddress);

        // Approve rDAI contract to spend our Dai
        approvedToken.approve(_rTokenAddress, uint256(-1));

        // Set hat to point to this contract
        changeHat(address(this));
    }

    function updateRecipient(address _newRecipient, uint256 _totalShares) public onlyOwner {
        // Create new hat and assign it to this contract
        // This causes previous interest to be paid out to the previous recipient
        changeHat(_newRecipient);

        // If previous recipient was this contract, send extra interest to new recipient
        uint256 _rDaiBalance = rToken.balanceOf(address(this));
        if (_rDaiBalance > _totalShares) {
          uint256 _surplus = _totalShares - _rDaiBalance;
          rToken.transfer(_newRecipient, _surplus);
        }
    }

    function changeHat(address _newRecipient) internal {
        address[] memory _recipients = new address[](1);
        _recipients[0] = _newRecipient;
        uint32[] memory _proportions = new uint32[](1);
        _proportions[0] = 1;
        bool doChangeHat = true;
        rToken.createHat(_recipients, _proportions, doChangeHat);
    }

    function convertToInterestEarningToken() public {
      // Check balance of Dai
      uint256 _tokenBalance = approvedToken.balanceOf(address(this));
      // Mint rDAI with appropriate hat settings
      (uint256 _hatId, , ) = rToken.getHatByAddress(address(this));
      rToken.mintWithSelectedHat(_tokenBalance, _hatId);
    }

    function withdraw(address receiver, uint256 shares) public onlyOwner returns (bool) {
        uint256 amount = shares;
        emit Withdrawal(receiver, amount);
        return rToken.redeemAndTransfer(receiver, shares);
    }
}