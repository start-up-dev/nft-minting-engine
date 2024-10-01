import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { PinataSDK } from "pinata-web3";
import NFTminting from "../artifacts/contracts/NFTminting.sol/NFTminting.json";

const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;
const PINATA_GATEWAY = process.env.REACT_APP_PINATA_GATEWAY;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

// Add Polygon Amoy testnet configuration
const POLYGON_AMOY_CHAIN_ID = "80002";
const POLYGON_AMOY_RPC_URL = "https://rpc-amoy.polygon.technology/";

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: PINATA_GATEWAY,
});

const NFTMinter = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [files, setFiles] = useState([]);
  const [names, setNames] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [mintingStep, setMintingStep] = useState("");
  const [networkError, setNetworkError] = useState(null);

  useEffect(() => {
    checkWalletConnection();
    // Add event listener for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
    // Cleanup function
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  useEffect(() => {
    if (account) {
      setupContract();
    }
  }, [account]);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount("");
      setNetworkError("Please connect to MetaMask");
    }
  };

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts", // Changed from eth_accounts to eth_requestAccounts
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          if (chainId !== POLYGON_AMOY_CHAIN_ID) {
            await switchToPolygonAmoy();
          }
          setNetworkError(null);
        } else {
          setNetworkError("Please connect to MetaMask");
        }
      } catch (error) {
        console.error("Error checking wallet connection", error);
        setNetworkError("Error connecting to wallet. Please try again.");
      }
    } else {
      setNetworkError(
        "Please install MetaMask and connect to Polygon Amoy testnet"
      );
    }
  };

  const switchToPolygonAmoy = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          { chainId: `0x${parseInt(POLYGON_AMOY_CHAIN_ID).toString(16)}` },
        ],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${parseInt(POLYGON_AMOY_CHAIN_ID).toString(16)}`,
                chainName: "Polygon Amoy Testnet",
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                rpcUrls: [POLYGON_AMOY_RPC_URL],
                blockExplorerUrls: ["https://www.oklink.com/amoy"],
              },
            ],
          });
        } catch (addError) {
          throw addError;
        }
      }
      throw switchError;
    }
  };

  const setupContract = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const newContract = new ethers.Contract(
        contractAddress,
        NFTminting.abi,
        signer
      );
      console.log("Contract setup successful:", newContract);
      setContract(newContract);
    } catch (error) {
      console.error("Error setting up contract:", error);
      setNetworkError(
        "Error setting up contract. Please check your connection and try again."
      );
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setNames(selectedFiles.map((file) => file.name));
    setDescriptions(
      selectedFiles.map((file) => `Description for ${file.name}`)
    );
  };

  const handleNameChange = (index, value) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  const mintNFT = async () => {
    if (!contract) {
      setError("Contract is not initialized. Please try again.");
      return;
    }

    if (
      files.length === 0 ||
      names.length !== files.length ||
      descriptions.length !== files.length
    ) {
      setError("Please provide files, names, and descriptions for all NFTs");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setMintingStep("Uploading files to IPFS...");
      const ipfsHashes = await Promise.all(
        files.map((file) => pinata.upload.file(file))
      );

      setMintingStep("Preparing metadata...");
      const metadataArray = ipfsHashes.map((result, index) => ({
        name: names[index],
        description: descriptions[index],
        image: `ipfs://${result.IpfsHash}`,
      }));

      const metadataResults = await Promise.all(
        metadataArray.map((metadata) => pinata.upload.json(metadata))
      );
      const metadataHashes = metadataResults.map(
        (result) => `ipfs://${result.IpfsHash}`
      );

      setMintingStep("Minting NFTs...");

      for (let i = 0; i < metadataHashes.length; i++) {
        const tokenId = ethers.toBigInt(Date.now() + i);

        console.log(`Minting NFT ${i + 1}:`);
        console.log("Token ID:", tokenId.toString());
        console.log("Metadata Hash:", metadataHashes[i]);

        const estimatedGas = await contract.mint.estimateGas(
          address,
          tokenId,
          metadataHashes[i],
          {
            from: address,
          }
        );

        console.log("Estimated gas:", estimatedGas.toString());

        const gasLimit = (estimatedGas * 120n) / 100n; // Add 20% buffer

        console.log("Gas limit:", gasLimit.toString());

        const transaction = await contract.mint(
          address,
          tokenId,
          metadataHashes[i],
          {
            gasLimit,
            from: address,
          }
        );

        console.log("Transaction:", transaction);

        const receipt = await transaction.wait();
        console.log(`NFT ${i + 1} minted successfully! Receipt:`, receipt);

        await storeTokenURIMapping(tokenId.toString(), metadataHashes[i]);
      }

      setSuccess("NFTs minted successfully!");
      setFiles([]);
      setNames([]);
      setDescriptions([]);
    } catch (error) {
      console.error("Error minting NFTs:", error);
      if (error.error && error.error.message) {
        setError(`Error minting NFTs: ${error.error.message}`);
      } else {
        setError(`Error minting NFTs: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
      setMintingStep("");
    }
  };

  async function storeTokenURIMapping(tokenId, ipfsHash) {
    console.log(`Storing mapping: TokenID ${tokenId} -> IPFS Hash ${ipfsHash}`);
    // Implement the actual storage logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            NFT Minter
          </h2>
          <div className="mt-2 flex items-center justify-center">
            <span
              className={`inline-block h-3 w-3 rounded-full mr-2 ${
                account ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <p className="text-sm text-gray-600">
              {account
                ? `Wallet Connected: ${account.slice(0, 6)}...${account.slice(
                    -4
                  )}`
                : "Wallet Disconnected"}
            </p>
          </div>
        </div>
        {!account && (
          <button
            onClick={checkWalletConnection}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Connect Wallet
          </button>
        )}
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="file-upload" className="sr-only">
                Choose files
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            {files.map((file, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder={`NFT ${index + 1} Name (${file.name})`}
                  value={names[index] || ""}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <input
                  type="text"
                  placeholder={`NFT ${index + 1} Description (${file.name})`}
                  value={descriptions[index] || ""}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>
            ))}
          </div>

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={mintNFT}
              disabled={isLoading}
            >
              {isLoading ? "Minting..." : "Mint NFTs"}
            </button>
          </div>
        </form>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mt-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4 mt-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>{success}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-indigo-500"
                viewBox="0 0 24 24"
              >
                {/* ... loading spinner ... */}
              </svg>
              {mintingStep}
            </div>
          </div>
        )}
        {networkError && (
          <div className="text-red-500 text-sm mt-2">{networkError}</div>
        )}
      </div>
    </div>
  );
};

export default NFTMinter;
