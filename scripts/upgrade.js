const { ethers, upgrades } = require("hardhat");

async function main() {
  const NFT = await ethers.getContractFactory("NFT");
  console.log("Upgrading NFT...");
  await upgrades.upgradeProxy(
    "0x216BF8302eCb04cD09Db0E4075907FE4c98af785",
    NFT
  );
  console.log("NFT upgraded");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
