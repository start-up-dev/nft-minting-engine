// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NFTminting {
    // Token name
    string public name;
    // Token symbol
    string public symbol;
    // Contract owner
    address public owner;

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;
    
    // Mapping owner address to token count
    mapping(address => uint256) private _balances;
    
    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;
    
    // Mapping from owner to operator approvals
    mapping(address => mapping(address=> bool)) private _operatorApprovals;

    // Mapping from token ID to token URI
    mapping(uint256 => string) private _tokenURIs;

    // Event for transfer
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    
    // Event for approval
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    
    // Event for approval for all
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    
    // Event for minting
    event Mint(address indexed to, uint256 indexed tokenId);

    // Constructor to set the token name and symbol
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender; // Set the contract deployer as the initial owner
    }

    // Modifier to restrict access to the owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    // Function to return the balance of an owner
    function balanceOf(address _owner) public view returns (uint256) {
        require(_owner != address(0), "Address zero is not a valid owner");
        return _balances[_owner];
    }

    // Function to return the owner of a token
    function ownerOf(uint256 tokenId) public view returns (address) {
        address tokenOwner = _owners[tokenId];
        require(tokenOwner != address(0), "Token ID does not exist");
        return tokenOwner;
    }

    // Function to transfer ownership of a token
    function transferFrom(address from, address to, uint256 tokenId) public payable {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Caller is not owner nor approved");
        require(from != address(0), "Transfer from the zero address");
        require(to != address(0), "Transfer to the zero address");
        
        // Royalty logic
        uint256 totalValue = msg.value;
        uint256 companyCut = totalValue * 3 / 100;
        uint256 firstCut = totalValue * 5 / 1000;
        uint256 secondCut = totalValue * 15 / 1000;
        uint256 thirdCut = totalValue * 25 / 1000;
        uint256 fourthCut = totalValue * 5 / 100;
        uint256 fifthCut = totalValue * 75 / 1000;
        uint256 sixthCut = totalValue * 15 / 100;
        uint256 remaining = totalValue - (companyCut + firstCut + secondCut + thirdCut + fourthCut + fifthCut + sixthCut);
        
        // Transfer royalty funds
        payable(0x0f75FF6088F2448874FF6970D9db686d8D7E70BD).transfer(companyCut);
        payable(0x4aB1847Fef9cC02523E107e34CF7D32F3D67E3F6).transfer(firstCut);
        payable(0x194043E80e905a45f101491a7A150F8Faf6Bd366).transfer(secondCut);
        payable(0xe2fF97A603500e9845f4609edf668d0805cF0743).transfer(thirdCut);
        payable(0x4488Ff8476a4d0B79543Aef4Fb97CDD8c997C140).transfer(fourthCut);
        payable(0xc7888869dB92614f4abfb0EAcc217e10861915D6).transfer(fifthCut);
        payable(0x89d003CD34C79859D32A56b2228188faF5d0583b).transfer(sixthCut);
        
        _transfer(from, to, tokenId);
        
        // Refund any remaining ETH to the seller
        payable(from).transfer(remaining);
    }

    // Internal function to transfer ownership of a token
    function _transfer(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "Transfer of token that is not own");
        require(to != address(0), "Transfer to the zero address");

        _beforeTokenTransfer(from, to, tokenId);

        _approve(address(0), tokenId);

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);

        _afterTokenTransfer(from, to, tokenId);
    }

    // Function to mint a new token
    function mint(address to, uint256 tokenId, string memory _tokenURI) public onlyOwner {
        require(to != address(0), "Mint to the zero address");
        require(!_exists(tokenId), "Token already minted");

        _beforeTokenTransfer(address(0), to, tokenId);

        _balances[to] += 1;
        _owners[tokenId] = to;
        _tokenURIs[tokenId] = _tokenURI;

        emit Transfer(address(0), to, tokenId);
        emit Mint(to, tokenId);

        _afterTokenTransfer(address(0), to, tokenId);
    }

    // Function to approve an address to transfer a specific token
    function approve(address to, uint256 tokenId) public {
        address tokenOwner = ownerOf(tokenId);
        require(to != tokenOwner, "Approval to current owner");

        require(
            msg.sender == tokenOwner || isApprovedForAll(tokenOwner, msg.sender),
            "Approve caller is not owner nor approved for all"
        );

        _approve(to, tokenId);
    }

    // Internal function to approve an address to transfer a specific token
    function _approve(address to, uint256 tokenId) internal {
        _tokenApprovals[tokenId] = to;
        emit Approval(ownerOf(tokenId), to, tokenId);
    }

    // Function to check if an address is approved for a specific token
    function getApproved(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "Token does not exist");

        return _tokenApprovals[tokenId];
    }

    // Function to set or unset the approval of a given operator
    function setApprovalForAll(address operator, bool approved) public {
        require(operator != msg.sender, "Approve to caller");

        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    // Function to check if an operator is approved for a given owner
    function isApprovedForAll(address _owner, address operator) public view returns (bool) {
        return _operatorApprovals[_owner][operator];
    }

    // Internal function to check if a token exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _owners[tokenId] != address(0);
    }

    // Internal function to check if an address is approved or the owner of a token
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        require(_exists(tokenId), "Token does not exist");
        address tokenOwner = ownerOf(tokenId);
        return (spender == tokenOwner || getApproved(tokenId) == spender || isApprovedForAll(tokenOwner, spender));
    }

    // Hook that is called before any token transfer
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual {}

    // Hook that is called after any token transfer
    function _afterTokenTransfer(address from, address to, uint256 tokenId) internal virtual {}

    // Add a function to get the token URI
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    // New function to batch mint NFTs
    function batchMint(address to, uint256[] memory tokenIds) public onlyOwner {
        require(to != address(0), "Mint to the zero address");
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            require(!_exists(tokenId), "Token already minted");

            _beforeTokenTransfer(address(0), to, tokenId);

            _balances[to] += 1;
            _owners[tokenId] = to;

            emit Transfer(address(0), to, tokenId);
            emit Mint(to, tokenId);

            _afterTokenTransfer(address(0), to, tokenId);
        }
    }
}
