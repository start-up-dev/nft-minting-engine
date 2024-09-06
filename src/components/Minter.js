import React, { useState, useEffect } from "react";
import { PinataSDK } from "pinata-web3";
import { ethers } from "ethers";
import NFT from "../artifacts/src/contracts/NFT.sol/NFT.json";

// Replace with your Pinata JWT and Gateway
const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;
const PINATA_GATEWAY = process.env.REACT_APP_PINATA_GATEWAY;

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: PINATA_GATEWAY,
});

function Minter() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkWalletConnection();
  }, []);

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadToIPFS = async () => {
    if (!walletConnected) {
      await checkWalletConnection();
      if (!walletConnected) return;
    }

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      const result = await pinata.upload.file(file);
      setIpfsHash(result.IpfsHash);
      setError("");
      console.log("File uploaded to IPFS with hash:", result.IpfsHash);
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      setError("Error uploading to IPFS. Please try again.");
    }
  };

  const handleMint = async () => {
    if (!walletConnected) {
      await checkWalletConnection();
      if (!walletConnected) return;
    }

    if (!ipfsHash || !name || !description) {
      setError("Please upload a file and provide name and description");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
      const contract = new ethers.Contract(contractAddress, NFT.abi, signer);

      const metadata = {
        name: name,
        description: description,
        image: `ipfs://${ipfsHash}`,
      };

      const metadataResult = await pinata.upload.json(metadata);
      const metadataHash = metadataResult.IpfsHash;

      const transaction = await contract.mintNFT(
        await signer.getAddress(),
        `ipfs://${metadataHash}`
      );
      await transaction.wait();

      console.log("NFT minted successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      setError("Error minting NFT. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            NFT Minter
          </h2>
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
                Choose file
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                onChange={handleFileChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="NFT Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="NFT Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div>
            <button
              onClick={handleUploadToIPFS}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Upload to IPFS
            </button>
          </div>

          {ipfsHash && (
            <div className="text-sm text-gray-600">IPFS Hash: {ipfsHash}</div>
          )}

          <div>
            <button
              onClick={handleMint}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Mint NFT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Minter;
