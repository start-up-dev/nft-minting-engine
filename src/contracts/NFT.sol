// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    uint256 private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("MyNFT", "MNFT") {
        _tokenIdCounter = 0;
    }

    function mintNFT(address recipient, string memory _tokenURI) public returns (uint256) {
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(recipient, newTokenId);
        _tokenURIs[newTokenId] = _tokenURI;
        _tokenIdCounter++;
        return newTokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenURIs[tokenId];
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
}