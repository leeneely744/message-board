import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
    const MessageBoard = await ethers.getContractFactory("MessageBoard");
    const messageBoard = await MessageBoard.deploy();

    await messageBoard.waitForDeployment();

    console.log("MessageBoard deployed to:", messageBoard.target);
}

main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});