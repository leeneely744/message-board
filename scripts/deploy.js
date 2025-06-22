import fs from "fs";
import pkg from "hardhat";
const { ethers } = pkg;

const FRONT_PATH = "../message-board-ui"

async function main() {
    const MessageBoard = await ethers.getContractFactory("MessageBoard");
    const messageBoard = await MessageBoard.deploy();

    await messageBoard.waitForDeployment();

    console.log("MessageBoard deployed to:", messageBoard.target);

    // Make sure to place the message-board-ui project in the same directory as this project.
    fs.writeFileSync(
        FRONT_PATH + "/src/contract-address.json",
        JSON.stringify({ address: messageBoard.target }, null, 2)
    );

    console.log("MessageBoard.json created successfully");

    const ABI_Path = "./artifacts/contracts/MessageBoard.sol/MessageBoard.json"
    const ABI = JSON.parse(fs.readFileSync(ABI_Path, "utf8")).abi;
    const FRONT_ABI_PATH = FRONT_PATH + "/src/MessageBoardABI.json"
    fs.writeFileSync(FRONT_ABI_PATH, JSON.stringify(ABI, null, 2));
    console.log("MessageBoardABI.json created successfully");
}

main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});