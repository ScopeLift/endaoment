pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";

interface ISablier {
    function createCompoundingStream(
        address recipient,
        uint256 deposit,
        address tokenAddress,
        uint256 startTime,
        uint256 stopTime,
        uint256 senderSharePercentage,
        uint256 recipientSharePercentage) external
                                          returns (uint256);

    function cancelStream(uint256 streamId) external returns (bool);
}

interface ICToken {
    function balanceOf(address) external returns (uint256);
    function approve(address, uint256) external returns (bool);
    function mint(uint256) external returns (uint256);
    function redeem(uint) external returns (uint);
}

contract GuildBank {
    using SafeMath for uint256;

    address owner;
    IERC20 approvedToken; // approved token contract reference
    ICToken cToken;       // equivalent cToken contract reference
    ISablier sablier;

    event Withdrawal(address indexed receiver, uint256 amount);
    event Deposit(uint256 indexed amount);

    constructor(address approvedTokenAddress, address cTokenAddress) public {
        owner = msg.sender;

        sablier = ISablier(0xA4fc358455Febe425536fd1878bE67FfDBDEC59a);
        cToken = ICToken(cTokenAddress);
        approvedToken = IERC20(approvedTokenAddress);

        approvedToken.approve(address(cToken), uint256(-1));
        cToken.approve(address(sablier), uint256(-1));
    }

    function deposit(uint256 amount) public returns (bool) {
        require(msg.sender == owner, "Not Owner");

        bool transferSuccess = approvedToken.transferFrom(msg.sender, address(this), amount);

        if (!transferSuccess) {
            return false;
        }

        uint256 mintCode = cToken.mint(amount);

        if (0 != mintCode) {
            return false;
        }

        emit Deposit(amount);

        return true;
    }

    function withdraw(address receiver, uint256 shares, uint256 totalShares) public returns (bool) {
        require(msg.sender == owner, "Not Owner");

        // should be 0 unless someone sent token to GB
        uint256 initialApprovedBalance = approvedToken.balanceOf(address(this));
        uint256 amount = cToken.balanceOf(address(this)).mul(shares).div(totalShares);
        uint256 redeemCode = cToken.redeem(amount);

        if (0 != redeemCode) {
            return false;
        }

        uint256 approvedAmount = approvedToken.balanceOf(address(this)).sub(initialApprovedBalance);

        emit Withdrawal(receiver, approvedAmount);
        return approvedToken.transfer(receiver, approvedAmount);
    }

    function initiateStream(address grantee, uint256 amount, uint256 startDate, uint256 endDate) public returns (uint256) {
        require(msg.sender == owner, "Not Owner");
        return sablier.createCompoundingStream(grantee, amount, address(cToken), startDate, endDate, 100, 0);
    }

    function revokeStream(uint256 streamId) public {
        require(msg.sender == owner, "Not Owner");
        sablier.cancelStream(streamId);
    }
}