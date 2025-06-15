import fs from "fs";
import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
    const MessageBoard = await ethers.getContractFactory("MessageBoard");
    const messageBoard = await MessageBoard.deploy();

    await messageBoard.waitForDeployment();

    console.log("MessageBoard deployed to:", messageBoard.target);

    // Make sure to place the message-board-ui project in the same directory as this project.
    fs.writeFileSync(
        "../message-board-ui/src/contract-address.json",
        JSON.stringify({ address: messageBoard.target }, null, 2)
    );

    console.log("MessageBoard.json created successfully");
}

main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});