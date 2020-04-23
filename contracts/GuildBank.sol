pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";

interface ISablier {
    function createStream(address recipient, uint256 deposit, address tokenAddress, uint256 startTime, uint256 stopTime) external returns (uint256);
}

contract GuildBank is Ownable {
    using SafeMath for uint256;

    IERC20 public approvedToken; // approved token contract reference
    ISablier public sablier;

    event Withdrawal(address indexed receiver, uint256 amount);

    constructor(address approvedTokenAddress) public {
        approvedToken = IERC20(approvedTokenAddress);
        sablier = ISablier(0xA4fc358455Febe425536fd1878bE67FfDBDEC59a);
        approvedToken.approve(address(sablier), uint256(-1));
    }

    function withdraw(address receiver, uint256 shares, uint256 totalShares) public onlyOwner returns (bool) {
        uint256 amount = approvedToken.balanceOf(address(this)).mul(shares).div(totalShares);
        emit Withdrawal(receiver, amount);
        return approvedToken.transfer(receiver, amount);
    }

    function initiateStream(address grantee, uint256 amount, uint256 duration) public {
        sablier.createStream(grantee, amount, address(approvedToken), block.timestamp, block.timestamp + duration);
    }
}