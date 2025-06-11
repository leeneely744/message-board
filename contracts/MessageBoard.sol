// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract MessageBoard {
    struct Message {
        address sender;
        string text;
        uint256 timestamp;
    }

    Message[] public messages;

    // Use 'indexed' for debugable
    event NewMessage(address indexed sender, string text, uint256 timestamp);

    constructor() {
        // pass
    }
}