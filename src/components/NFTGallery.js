import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import NFTminting from "../artifacts/contracts/NFTminting.sol/NFTminting.json";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const POLYGONSCAN_API_URL = "https://api-testnet.polygonscan.com/api";
const AMOY_RPC_URL = process.env.REACT_APP_AMOY_RPC_URL;
const POLYGONSCAN_API_KEY = process.env.REACT_APP_POLYGONSCAN_API_KEY;

function NFTGallery() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      if (!AMOY_RPC_URL) {
        throw new Error("Amoy RPC URL is not set");
      }

      const provider = new ethers.JsonRpcProvider(AMOY_RPC_URL);
      const contract = new ethers.Contract(
        contractAddress,
        NFTminting.abi,
        provider
      );

      const fetchedNFTs = await fetchNFTsByID(contract);
      setNfts(fetchedNFTs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setError("Failed to load NFTs. Please try again later.");
      setLoading(false);
    }
  };

  const fetchNFTsByID = async (contract) => {
    const fetchedNFTs = [];
    let tokenId = 1n;
    let consecutiveErrors = 0;
    const maxConsecutiveErrors = 100; // Increased to allow for larger gaps
    const maxAttempts = 1000; // Limit total attempts to prevent infinite loop

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      try {
        const nft = await fetchSingleNFT(contract, tokenId);
        if (nft) {
          fetchedNFTs.push(nft);
          consecutiveErrors = 0; // Reset error count on successful fetch
        } else {
          consecutiveErrors++;
        }
      } catch (error) {
        console.error(`Error fetching NFT ${tokenId}:`, error);
        consecutiveErrors++;
      }

      if (consecutiveErrors >= maxConsecutiveErrors) {
        console.log(`Stopped after ${maxConsecutiveErrors} consecutive errors`);
        break;
      }

      tokenId = tokenId + 1n;
    }

    console.log(`Fetched NFTs: ${fetchedNFTs.length}`);
    return fetchedNFTs;
  };

  const fetchSingleNFT = async (contract, tokenId) => {
    try {
      const owner = await contract.ownerOf(tokenId);
      let tokenURI;
      try {
        tokenURI = await contract.tokenURI(tokenId);
        tokenURI = tokenURI.startsWith("ipfs://")
          ? tokenURI
          : `ipfs://${tokenURI}`;
      } catch (error) {
        console.warn(`TokenURI not set for token ${tokenId}`);
        tokenURI = null;
      }
      const metadata = tokenURI ? await fetchMetadata(tokenURI) : null;
      const history = await fetchNFTHistory(tokenId);

      return {
        id: tokenId.toString(),
        owner,
        metadata,
        history,
      };
    } catch (error) {
      if (error.message.includes("owner query for nonexistent token")) {
        // NFT doesn't exist, return null
        return null;
      }
      // For other errors, throw to be caught by the caller
      throw error;
    }
  };

  const fetchMetadata = async (tokenURI) => {
    try {
      const response = await fetch(
        tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
      );
      const metadata = await response.json();
      return metadata;
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return { name: "Unknown", description: "Metadata not available" };
    }
  };

  const fetchNFTHistory = async (tokenId) => {
    try {
      const url = `${POLYGONSCAN_API_URL}?module=account&action=tokennfttx&contractaddress=${contractAddress}&sort=asc&apikey=${POLYGONSCAN_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "1" && data.result.length > 0) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          NFT Gallery
        </h2>
        {nfts.length === 0 ? (
          <div className="text-center text-gray-500 text-xl">
            No NFTs found. Start minting to see your collection!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {nfts.map((nft) => (
              <div key={nft.id} className="group">
                <div className="w-full bg-white rounded-lg overflow-hidden shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-2xl">
                  <div className="relative pb-48 overflow-hidden">
                    {nft.metadata && nft.metadata.image ? (
                      <img
                        className="absolute inset-0 h-full w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                        src={nft.metadata.image.replace(
                          "ipfs://",
                          "https://ipfs.io/ipfs/"
                        )}
                        alt={nft.metadata.name || `NFT #${nft.id}`}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
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
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {nft.metadata?.name || `NFT #${nft.id}`}
                    </h3>
                    {nft.metadata?.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {nft.metadata.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Owner: {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                      </p>
                      <button
                        onClick={() => {
                          /* Implement view details logic */
                        }}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NFTGallery;
