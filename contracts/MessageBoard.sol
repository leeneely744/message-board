// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

error NotAuthor();

contract MessageBoard {
    struct Message {
        address sender;
        string text;
        uint256 timestamp;
    }

    // public: automatically generate getter function
    Message[] public messages;
    uint256 public totalTip;

    // Use 'indexed' for debugable
    event NewMessage(address indexed sender, string text, uint256 timestamp);
    event TipReceived(address indexed sender, uint256 amount);

    constructor() {
        // pass
    }

    modifier onlyAuthor(uint256 id) {
        require(id < messages.length, "Invalid message ID");
        if (messages[id].sender != msg.sender) {
            revert NotAuthor();
        }
        _;
    }

    // calldata: imutable temp memory used in function's parameter only
    // In the future, it is require 'reentracyGuard' and 'ownerOnly'
    // payable: allow payment in the function
    function postMessage(string calldata _text) external payable {
        // memory: mutable temp memory
        Message memory newMessage = Message(msg.sender, _text, block.timestamp);
        messages.push(newMessage);
        emit NewMessage(msg.sender, _text, block.timestamp);
        totalTip += msg.value;
        emit TipReceived(msg.sender, msg.value);
    }

    function getMessageCount() external view returns (uint256) {
        return messages.length;
    }

    function getLatestMessages(uint256 count) external view returns (Message[] memory) {
        uint256 total = messages.length;

        if (count > total) {
            count = total;
        }

        Message[] memory latestMessages = new Message[](count);
        for (uint256 i = 0; i < count; i++) {
            latestMessages[i] = messages[total - 1 - i];
        }
        return latestMessages;
    }
}