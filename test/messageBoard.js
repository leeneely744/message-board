const { expect } = require("chai");
const hre = require("hardhat");

describe("MessageBoard", function () {
  it("should deploy successfully", async function () {
    // コントラクトファクトリを取得
    const MessageBoard = await hre.ethers.getContractFactory("MessageBoard");
    // デプロイ
    const board = await MessageBoard.deploy();
    await board.waitForDeployment();

    // コントラクトアドレスが存在するか確認
    expect(board.target).to.properAddress;
  });

  it("should store a message when postMessage is called", async function () {
    const MessageBoard = await hre.ethers.getContractFactory("MessageBoard");
    const board = await MessageBoard.deploy();
    await board.waitForDeployment();

    const [sender] = await hre.ethers.getSigners();
    const testText = "Hello, blockchain!";

    // post a message
    await board.connect(sender).postMessage(testText);

    const count = await board.getMessageCount();
    expect(count).to.equal(1);

    const messages = await board.getLatestMessages(1);
    const message = messages[0];

    expect(message.sender).to.equal(sender.address);
    expect(message.text).to.equal(testText);
    expect(message.timestamp).to.be.a("bigint");
  })
});
