// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

error NotAuthor();
error InvalidMessageId();
error MessageAlreadyDeleted();
error TooRapidPost();
error TooLongText();

contract MessageBoard {
    struct Message {
        address sender;
        string text;
        uint256 timestamp;
        bool deleted;
    }

    // public: automatically generate getter function
    uint256 public totalTip;
    mapping (uint256=>Message) public messages;
    uint256 public messageCount = 0;
    uint256 public headId;

    uint256 public constant messageLimit = 10;
    mapping (address=>uint256) public lastPostAt;
    uint256 public constant COOLDOWN_SECONDS = 60;
    uint256 public constant MAX_TEXT_BYTES = 32;

    // Use 'indexed' for debugable
    event NewMessage(address indexed sender, string text, uint256 timestamp);
    event TipReceived(address indexed sender, uint256 amount);
    event MessageEdited(uint256 indexed id, string newText, uint256 timestamp);
    event MessageDeleted(uint256 indexed id, uint256 timestamp);

    constructor() {
        // pass
    }

    modifier onlyAuthor(uint256 id) {
        if (id >= messageCount || id < headId) {
            revert InvalidMessageId();
        }

        if (messages[id].sender != msg.sender) {
            revert NotAuthor();
        }
        _;
    }

    modifier isNotRapid() {
        uint256 lastPostTimestamp = lastPostAt[msg.sender];
        if (block.timestamp - lastPostTimestamp < COOLDOWN_SECONDS) {
            revert TooRapidPost();
        }
        _;
    }

    // calldata: imutable temp memory used in function's parameter only
    // In the future, it is require 'reentracyGuard' and 'ownerOnly'
    // payable: allow payment in the function
    function postMessage(string calldata _text) external payable isNotRapid() {
        if (bytes(_text).length > MAX_TEXT_BYTES) revert TooLongText();

        // memory: mutable temp memory
        Message memory newMessage = Message(msg.sender, _text, block.timestamp, false);
        emit NewMessage(msg.sender, _text, block.timestamp);
        totalTip += msg.value;
        emit TipReceived(msg.sender, msg.value);
        lastPostAt[msg.sender] = block.timestamp;
        messages[messageCount] = newMessage;
        messageCount++;

        // delete over messageLimit
        if (messageCount - headId == messageLimit) {
            delete messages[headId];
            emit MessageDeleted(headId, block.timestamp);
            headId += 1;
        }
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

    // TODO: deleted=true を数えないようにする
    function getMessageCount() external view returns (uint256) {
        return messageCount;
    }

    function getLatestMessages(uint256 count) external view returns (uint256[] memory ids, Message[] memory msgs) {
        uint256 available = messageCount - headId;
        uint256 n = (count > available) ? available : count;

        ids = new uint256[](count);
        msgs = new Message[](count);

        for (uint256 i = 0; i < n; i++) {
            uint256 idx = i - 1;
            ids[i] = idx;
            msgs[i] = messages[idx];
        }

        assembly {
            mstore(ids, n)
            mstore(msgs,n)
        }
    }
}