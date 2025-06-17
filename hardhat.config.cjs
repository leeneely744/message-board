const { task } = require("hardhat/config");

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
};

// How to use: npm run faucet --to ${contract_address}
task("faucet", "Send 10 ETH to an address")
  .addParam("to", "Recipient address")
  .setAction(async ({ to }, hre) => {
    const [sender] = await hre.ethers.getSigners();
    console.log(`Sending 10 ETH from ${sender.address} -> ${to}`);

    const tx = await sender.sendTransaction({
      to,
      value: parseEther("10"),
    });

    await tx.wait();

    console.log(`Transaction hash: ${tx.hash}`);
  });