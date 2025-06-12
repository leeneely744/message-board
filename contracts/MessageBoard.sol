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

    // calldata: imutable temp memory used in function's parameter only
    function postMessage(string calldata _text) external {
        // memory: mutable temp memory
        Message memory newMessage = Message(msg.sender, _text, block.timestamp);
        messages.push(newMessage);
        emit NewMessage(msg.sender, _text, block.timestamp);
    }

    function getMessageCount() external view returns (uint256) {
        return messages.length;
    }
    
}