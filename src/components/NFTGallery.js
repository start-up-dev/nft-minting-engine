import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import NFT from "../artifacts/src/contracts/NFT.sol/NFT.json";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const ETHERSCAN_API_URL = "https://api-sepolia.etherscan.io/api";
const SEPOLIA_RPC_URL = process.env.REACT_APP_SEPOLIA_RPC_URL;
const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;

function NFTGallery() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        if (!SEPOLIA_RPC_URL) {
          throw new Error("Sepolia RPC URL is not set");
        }

        const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
        const contract = new ethers.Contract(
          contractAddress,
          NFT.abi,
          provider
        );

        // Check if totalSupply function exists
        if (typeof contract.totalSupply !== "function") {
          console.warn(
            "totalSupply function not found in the contract. Fetching NFTs by ID."
          );
          await fetchNFTsByID(contract);
        } else {
          const totalSupply = await contract.totalSupply();
          console.log(`Total Supply: ${totalSupply.toString()}`);
          await fetchNFTsBySupply(contract, totalSupply);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const fetchNFTsBySupply = async (contract, totalSupply) => {
    const fetchedNFTs = [];
    const supply =
      typeof totalSupply === "object" && totalSupply.toNumber
        ? totalSupply.toNumber()
        : Number(totalSupply);

    for (let tokenId = 1; tokenId <= supply; tokenId++) {
      try {
        const nft = await fetchSingleNFT(contract, tokenId);
        if (nft) {
          fetchedNFTs.push(nft); // Only push if the NFT exists
        }
      } catch (error) {
        console.error(`Error fetching NFT ${tokenId}:`, error);
      }
    }
    console.log(`Fetched NFTs: ${fetchedNFTs.length}`);
    setNfts(fetchedNFTs);
  };

  const fetchNFTsByID = async (contract) => {
    const fetchedNFTs = [];
    let tokenId = 1;
    while (true) {
      try {
        const nft = await fetchSingleNFT(contract, tokenId);
        if (nft) {
          fetchedNFTs.push(nft); // Only push if the NFT exists
        }
        tokenId++;
      } catch (error) {
        if (error.reason === "Token does not exist") {
          console.log(`No more NFTs found after ID ${tokenId - 1}`);
          break;
        } else {
          console.error(`Error fetching NFT ${tokenId}:`, error);
        }
      }
    }
    console.log(`Fetched NFTs: ${fetchedNFTs.length}`);
    setNfts(fetchedNFTs);
  };

  const fetchSingleNFT = async (contract, tokenId) => {
    try {
      console.log(`Fetching token ${tokenId}`);
      const tokenURI = await contract.tokenURI(tokenId);
      console.log(`Token ${tokenId} URI: ${tokenURI}`);
      const owner = await contract.ownerOf(tokenId);
      console.log(`Token ${tokenId} owner: ${owner}`);
      const history = await fetchNFTHistory(tokenId);
      const metadata = await fetchMetadata(tokenURI);

      return {
        id: tokenId,
        tokenURI,
        owner,
        history,
        metadata,
      };
    } catch (error) {
      if (error.reason === "Token does not exist") {
        console.log(`Token ${tokenId} does not exist`);
        return null; // Return null if the token does not exist
      } else {
        throw error; // Re-throw other errors
      }
    }
  };

  const fetchMetadata = async (tokenURI) => {
    try {
      let url = tokenURI;
      if (tokenURI.startsWith("ipfs://")) {
        url = `https://ipfs.io/ipfs/${tokenURI.slice(7)}`;
      }
      const response = await fetch(url);
      const metadata = await response.json();
      return metadata;
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return null;
    }
  };

  const fetchNFTHistory = async (tokenId) => {
    try {
      const url = `${ETHERSCAN_API_URL}?module=account&action=tokennfttx&contractaddress=${contractAddress}&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "1" && data.result.length > 0) {
        // Filter transactions for the specific tokenId
        const filteredTransactions = data.result.filter(
          (tx) => tx.tokenID === tokenId.toString()
        );
        return filteredTransactions.map((tx) => ({
          from: tx.from,
          to: tx.to,
          timestamp: new Date(tx.timeStamp * 1000).toLocaleString(),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching NFT history:", error);
      return [];
    }
  };

  console.log(nfts);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#ffffffa0] rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
        NFT Gallery
      </h2>
      <div className="space-y-6">
        {nfts.map((nft) => (
          <div
            key={nft.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
          >
            <div className="flex flex-col md:flex-row">
              {nft.metadata && nft.metadata.image ? (
                <div className="md:w-1/3 lg:w-1/4">
                  <img
                    src={nft.metadata.image.replace(
                      "ipfs://",
                      "https://ipfs.io/ipfs/"
                    )}
                    alt={nft.metadata.name || `NFT #${nft.id}`}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
              ) : (
                <div className="md:w-1/3 lg:w-1/4 bg-gray-300 flex items-center justify-center h-48 md:h-full">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
              )}
              <div className="p-6 flex-grow">
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  {nft.metadata?.name || `NFT #${nft.id}`}
                </h3>
                {nft.metadata?.description && (
                  <p className="mb-4 text-gray-600">
                    {nft.metadata.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-4">
                  <p className="text-gray-600">
                    <span className="font-semibold">Owner:</span> {nft.owner}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Token URI:</span>{" "}
                    <a
                      href={nft.tokenURI}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {nft.tokenURI}
                    </a>
                  </p>
                </div>
                <h4 className="font-semibold mt-6 mb-3 text-gray-800">
                  Exchange History:
                </h4>
                <ul className="space-y-3">
                  {nft.history.map((event, index) => (
                    <li
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 shadow-sm transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-700 bg-gray-200 rounded-full px-2 py-1">
                            {event.from.slice(0, 6)}...{event.from.slice(-4)}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-medium text-gray-700 bg-gray-200 rounded-full px-2 py-1">
                            {event.to.slice(0, 6)}...{event.to.slice(-4)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {event.timestamp}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NFTGallery;
