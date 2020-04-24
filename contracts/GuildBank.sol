pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";

interface ISablier {
    function createStream(address recipient, uint256 deposit, address tokenAddress, uint256 startTime, uint256 stopTime) external returns (uint256);
    function cancelStream(uint256 streamId) external returns (bool);
}

contract GuildBank {
    using SafeMath for uint256;

    address public owner;
    IERC20 public approvedToken; // approved token contract reference
    ISablier public sablier;

    event Withdrawal(address indexed receiver, uint256 amount);

    constructor(address approvedTokenAddress) public {
        owner = msg.sender;
        approvedToken = IERC20(approvedTokenAddress);
        sablier = ISablier(0xA4fc358455Febe425536fd1878bE67FfDBDEC59a);
        approvedToken.approve(address(sablier), uint256(-1));
    }

    function withdraw(address receiver, uint256 shares, uint256 totalShares) public onlyOwner returns (bool) {
        uint256 amount = approvedToken.balanceOf(address(this)).mul(shares).div(totalShares);
        emit Withdrawal(receiver, amount);
        return approvedToken.transfer(receiver, amount);
    }

    function initiateStream(address grantee, uint256 amount, uint256 startDate, uint256 endDate) public onlyOwner returns (uint256) {
        return sablier.createStream(grantee, amount, address(approvedToken), startDate, endDate);
    }

    function revokeStream(uint256 streamId) public onlyOwner {
        sablier.cancelStream(streamId);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Endaoment::GuildBank - Not Owner");
        _;
    }
}