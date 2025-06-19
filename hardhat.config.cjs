/** @type import('hardhat/config').HardhatUserConfig */
const { task } = require("hardhat/config");
const { parseEther } = require("ethers");
require("@nomicfoundation/hardhat-toolbox");

// npx hardhat faucet --network localhost --to ${MetaMask_account_address}
task("faucet", "Send 10 ETH to an address")
  .addParam("to", "Recipient address")
  .setAction(async ({ to }, hre) => {
    const [sender] = await hre.ethers.getSigners();

    console.log(`💧 Sending 10 ETH from ${sender.address} → ${to}`);

    const tx = await sender.sendTransaction({
      to,
      value: parseEther("10"),
    });

    await tx.wait();
    console.log(`✅ TX mined: ${tx.hash}`);
  });

// npx hardhat balance --account ${account_address}
task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs) => {
    const balance = await ethers.provider.getBalance(taskArgs.account);

    console.log(ethers.formatEther(balance), "ETH");
  });

module.exports = {
  solidity: "0.8.28",
};
