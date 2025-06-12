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
});
