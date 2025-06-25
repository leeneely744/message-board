// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

error NotAuthor();
error InvalidMessageId();
error MessageAlreadyDeleted();

contract MessageBoard {
    struct Message {
        address sender;
        string text;
        uint256 timestamp;
        bool deleted;
    }

    // public: automatically generate getter function
    Message[] public messages;
    uint256 public totalTip;

    // Use 'indexed' for debugable
    event NewMessage(address indexed sender, string text, uint256 timestamp);
    event TipReceived(address indexed sender, uint256 amount);
    event MessageEdited(uint256 indexed id, string newText, uint256 timestamp);
    event MessageDeleted(uint256 indexed id, uint256 timestamp);

    constructor() {
        // pass
    }

    modifier onlyAuthor(uint256 id) {
        if (id >= messages.length) {
            revert InvalidMessageId();
        }

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
        Message memory newMessage = Message(msg.sender, _text, block.timestamp, false);
        messages.push(newMessage);
        emit NewMessage(msg.sender, _text, block.timestamp);
        totalTip += msg.value;
        emit TipReceived(msg.sender, msg.value);
    }

    function editMessage(uint256 id, string calldata newText) external onlyAuthor(id) {
        messages[id].text = newText;
        messages[id].timestamp = block.timestamp;
        emit MessageEdited(id, newText, block.timestamp);
    }

    function deleteMessage(uint256 id) external onlyAuthor(id) {
        if (messages[id].deleted == true) {
            revert MessageAlreadyDeleted();
        }
        messages[id].deleted = true;
        emit MessageDeleted(id, block.timestamp);
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