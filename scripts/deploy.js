const hre = require("hardhat");

async function main() {
  console.log("Deploying NFT contract...");

  // Get the Contract factory
  const NFT = await hre.ethers.getContractFactory("NFT");

  // Deploy the contract
  const nft = await NFT.deploy();

  // Wait for the contract to be deployed
  await nft.waitForDeployment();

  // Get the contract address
  const contractAddress = await nft.getAddress();

  console.log("NFT contract deployed to:", contractAddress);

  // Optionally, you can verify the contract on Etherscan here
  // This step is usually done for public networks, not for local development
  // if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
  //   await nft.deployTransaction.wait(6);
  //   await verify(contractAddress, []);
  // }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Uncomment this function if you want to verify your contract on Etherscan
// async function verify(contractAddress, args) {
//   console.log("Verifying contract...");
//   try {
//     await hre.run("verify:verify", {
//       address: contractAddress,
//       constructorArguments: args,
//     });
//   } catch (e) {
//     if (e.message.toLowerCase().includes("already verified")) {
//       console.log("Already verified!");
//     } else {
//       console.log(e);
//     }
//   }
// }
