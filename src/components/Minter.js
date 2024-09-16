import React, { useState, useEffect } from "react";
import { PinataSDK } from "pinata-web3";
import { ethers } from "ethers";
import NFT from "../artifacts/src/contracts/NFT.sol/NFT.json";

const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;
const PINATA_GATEWAY = process.env.REACT_APP_PINATA_GATEWAY;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: PINATA_GATEWAY,
});

function Minter() {
  const [files, setFiles] = useState([]);
  const [names, setNames] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mintingStep, setMintingStep] = useState("");
  const [contract, setContract] = useState(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  useEffect(() => {
    if (walletConnected) {
      setupContract();
    }
  }, [walletConnected]);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletConnected(true);
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  const setupContract = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const newContract = new ethers.Contract(contractAddress, NFT.abi, signer);
      setContract(newContract);
    } catch (error) {
      console.error("Error setting up contract:", error);
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

  const handleMint = async () => {
    if (!walletConnected) {
      await checkWalletConnection();
      if (!walletConnected) return;
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

    try {
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
      if (!contract) {
        throw new Error("Contract is not initialized");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      console.log("Batch minting with parameters:", address, metadataHashes);
      const transaction = await contract.batchMintNFT(address, metadataHashes);
      console.log("Batch minting transaction sent:", transaction.hash);
      console.log("Waiting for confirmation...");
      const receipt = await transaction.wait();
      console.log("Transaction confirmed:", receipt);

      console.log("NFTs minted successfully!");
      setMintingStep("NFTs minted successfully!");

      // Reset form fields
      setFiles([]);
      setNames([]);
      setDescriptions([]);
    } catch (error) {
      console.error("Error minting NFTs:", error);
      setError("Error minting NFTs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNFTData = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, NFT.abi, signer);

      // Check if totalSupply function exists
      if (typeof contract.totalSupply !== "function") {
        console.warn(
          "totalSupply function not found in the contract. Fetching NFTs by ID."
        );
        await fetchNFTsByID(contract);
      }
    } catch (error) {
      console.error("Error fetching NFT data:", error);
    }
  };

  const fetchNFTsByID = async (contract) => {
    let tokenId = 1;
    while (true) {
      try {
        await contract.tokenURI(tokenId);
        tokenId++;
      } catch (error) {
        console.log(`No more NFTs found after ID ${tokenId - 1}`);
        break;
      }
    }
  };

  useEffect(() => {
    if (contract) {
      fetchNFTData();
    }
  }, [contract]);

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-10 mx-auto rounded-xl shadow-lg">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          NFT Minter
        </h2>
        <div className="mt-2 flex items-center justify-center">
          <span
            className={`inline-block h-3 w-3 rounded-full mr-2 ${
              walletConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          <p className="text-sm text-gray-600">
            {walletConnected ? "Wallet Connected" : "Wallet Disconnected"}
          </p>
        </div>
      </div>
      <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
        {!walletConnected && (
          <button
            onClick={checkWalletConnection}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Connect Wallet
          </button>
        )}
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
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          ))}
        </div>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <div>
          <button
            onClick={handleMint}
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            }`}
          >
            {isLoading ? "Minting..." : "Mint NFTs"}
          </button>
        </div>

        {isLoading && (
          <div className="text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-indigo-500"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {mintingStep}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default Minter;
