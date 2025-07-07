const { expect } = require("chai");
const hre = require("hardhat");

// npx hardhat test
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

  it("keeps length at 10 by tombstoning the oldest message", async function () {
    const MessageBoard = await hre.ethers.getContractFactory("MessageBoard");
    const board = await MessageBoard.deploy();
    await board.waitForDeployment();

    const [sender] = await hre.ethers.getSigners();
    const testText = "message";

    const cooldown = 60;
    for (let index = 0; index < 11; index++) {
      await (await board.connect(sender).postMessage(testText)).wait();      
      await hre.ethers.provider.send("evm_increaseTime", [cooldown]);
      await hre.ethers.provider.send("evm_mine");
    }

    const msg0 = await board.messages(0);
    expect(msg0.deleted).to.equal(true);
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

    const message = await board.messages(0);

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
    const [_, msgs] = await board.getLatestMessages(1);
    expect (msgs[0].text).to.equal(editedText);

    // 送信者でなければ編集できない。
    const [, newSender] = await hre.ethers.getSigners();
    await expect(board.connect(newSender).editMessage(0, "Error!")).to.be.revertedWithCustomError(
      board,
      "NotAuthor"
    );
  });

  it("should delete own message", async function() {
    const MessageBoard = await hre.ethers.getContractFactory("MessageBoard");
    const board = await MessageBoard.deploy();
    await board.waitForDeployment();

    const [sender] = await hre.ethers.getSigners();
    const testText = "Hello, blockchain!";

    await board.connect(sender).postMessage(testText);

    // 送信者でなければ削除できない。
    const [, newSender] = await hre.ethers.getSigners();
    await expect(board.connect(newSender).deleteMessage(0)).to.be.revertedWithCustomError(
      board,
      "NotAuthor"
    );

    // 送信者なら削除できる。
    await board.connect(sender).deleteMessage(0);
    const message = await board.messages(0);
    // 論理削除
    expect (message.deleted).to.equal(true);
  });

});
