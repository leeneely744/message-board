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
  });

  it("should return the latest N messages in reverse order", async function () {
    const MessageBoard = await hre.ethers.getContractFactory("MessageBoard");
    const board = await MessageBoard.deploy();
    await board.waitForDeployment();

    const [user] = await hre.ethers.getSigners();

    const texts = ["One", "Two", "Three"];
    for (const text of texts) {
      await board.connect(user).postMessage(text);
    }

    const latest = await board.getLatestMessages(2);

    // 最新2件は ["Three", "Two"] の順で返るはず
    expect(latest.length).to.equal(2);
    expect(latest[0].text).to.equal("Three");
    expect(latest[1].text).to.equal("Two");
  });

  it("should update own message", async function () {
    const MessageBoard = await hre.ethers.getContractFactory("MessageBoard");
    const board = await MessageBoard.deploy();
    await board.waitForDeployment();

    const [sender] = await hre.ethers.getSigners();
    const testText = "Hello, blockchain!";

    await board.connect(sender).postMessage(testText);

    const editedText = "Helle, next message!";
    await board.editMessage(0, editedText);

    // 送信者自身であれば編集できる。
    const latest = await board.getLatestMessages(1);
    expect (latest[0].text).to.equal(editedText);

    // 送信者でなければ編集できない。
    const [, newSender] = await hre.ethers.getSigners();
    await expect(board.connect(newSender).editMessage(0, "Error!")).to.be.revertedWithCustomError(
      board
    );
  });

});
