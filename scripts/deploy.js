const hre = require("hardhat");

async function main() {
  const NFTminting = await hre.ethers.getContractFactory("NFTminting");
  const nftMinting = await NFTminting.deploy("MyNFT", "MNFT");

  await nftMinting.waitForDeployment();

  console.log("NFTminting deployed to:", await nftMinting.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
