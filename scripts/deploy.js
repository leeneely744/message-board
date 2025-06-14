import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
    const MessageBoard = await ethers.getContractFactory("MessageBoard");
    const messageBoard = await MessageBoard.deploy();

    await messageBoard.waitForDeployment();

    console.log("MessageBoard deployed to:", messageBoard.address);
}
