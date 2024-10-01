require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.20",
  networks: {
    polygonAmoy: {
      url: "https://rpc-amoy.polygon.technology/",
      accounts: [PRIVATE_KEY],
      chainId: 80002,
    },
  },
};
