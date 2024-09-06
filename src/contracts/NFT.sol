// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721, ERC721URIStorage {
    uint256 private _nextTokenId;

    constructor() ERC721("MyNFT", "MNFT") {
        _nextTokenId = 1;
    }

    function mintNFT(address recipient, string memory _tokenURI) public returns (uint256) {
        uint256 newItemId = _nextTokenId;
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        _nextTokenId++;
        return newItemId;
    }

    // Override required functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}