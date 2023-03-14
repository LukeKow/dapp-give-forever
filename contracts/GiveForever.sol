// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ILido is IERC20 {
    function submit(address _referral) external payable returns (uint256 StETH);
    function withdraw(uint256 _amount, bytes32 _pubkeyHash) external; // wont be available until post-merge
    function sharesOf(address _owner) external returns (uint balance);
}

import "hardhat/console.sol";

contract GiveForever {
    address charity = 0xFc3E745ad938deB66616F40653b46CAEe7848369; // Givewell 0x7cF2eBb5Ca55A8bd671A020F8BDbAF07f60F26C1
    address public stETH = 0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F; // Goerli
    uint public donated;

    function deposit() payable public {
        ILido(stETH).submit{value: msg.value}(address(this));
        donated += msg.value;
    }

    function withdraw() public {
        uint balance = ILido(stETH).balanceOf(address(this));
        uint surplus = balance - donated;
        require(surplus > 0, "Nothing to return");
        ILido(stETH).transfer(charity, surplus);
    }

    function updateWallet(address _newAddress) public {
        require(msg.sender == charity, "Only charity can update wallet");
        charity = _newAddress;
    }
} 