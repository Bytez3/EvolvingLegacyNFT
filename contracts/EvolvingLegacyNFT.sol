// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EvolvingLegacyNFT is ERC721A, Ownable {
    using Strings for uint256;

    // Base URI for metadata
    string private _baseURIextended;

    // Constants for staking and leveling
    uint256 public constant TIME_PER_LEVEL = 7 days;
    uint256 public constant MAX_LEVEL = 10;

    // Mappings to track staking and level state
    mapping(uint256 => bool) public isStaked;          // Whether the NFT is staked
    mapping(uint256 => uint256) public stakingStartTime; // Time when staking began for the current level
    mapping(uint256 => uint256) public level;          // Current level of the NFT

    // Events for tracking actions
    event Staked(uint256 indexed tokenId, address indexed owner);
    event Unstaked(uint256 indexed tokenId, address indexed owner);
    event LeveledUp(uint256 indexed tokenId, uint256 newLevel);

    // Constructor with NFT name and symbol
    constructor() ERC721A("EvolvingLegacyNFT", "ELNFT") {}

    // Set the base URI for metadata (only owner can call)
    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseURIextended = baseURI_;
    }

    // Internal function to get the base URI
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }

    // Mint new NFTs and set initial level to 1
    function mint(address to, uint256 quantity) external onlyOwner {
        uint256 startTokenId = _nextTokenId();
        _mint(to, quantity);
        for (uint256 i = 0; i < quantity; i++) {
            level[startTokenId + i] = 1;
        }
    }

    // Stake an NFT to start the leveling process
    function stake(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(!isStaked[tokenId], "Already staked");
        isStaked[tokenId] = true;
        stakingStartTime[tokenId] = block.timestamp;
        emit Staked(tokenId, msg.sender);
    }

    // Level up an NFT after sufficient staking time
    function levelUp(uint256 tokenId) external {
        require(isStaked[tokenId], "Not staked");
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(level[tokenId] < MAX_LEVEL, "Max level reached");
        require(block.timestamp >= stakingStartTime[tokenId] + TIME_PER_LEVEL, "Too early");
        level[tokenId] += 1;
        stakingStartTime[tokenId] = block.timestamp; // Reset for next level
        emit LeveledUp(tokenId, level[tokenId]);
    }

    // Unstake an NFT, stopping the leveling process
    function unstake(uint256 tokenId) external {
        require(isStaked[tokenId], "Not staked");
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        isStaked[tokenId] = false;
        emit Unstaked(tokenId, msg.sender);
    }

    // Override transfer to prevent moving staked NFTs
    function _transfer(address from, address to, uint256 tokenId) internal virtual override {
        require(!isStaked[tokenId], "Token is staked");
        super._transfer(from, to, tokenId);
    }

    // Return the metadata URI based on the current level
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        uint256 currentLevel = level[tokenId] == 0 ? 1 : level[tokenId];
        return string(abi.encodePacked(_baseURI(), tokenId.toString(), "_", currentLevel.toString(), ".json"));
    }

    // View function to get the current level
    function getLevel(uint256 tokenId) public view returns (uint256) {
        return level[tokenId] == 0 ? 1 : level[tokenId];
    }

    // View function to check time until next level up
    function timeUntilNextLevelUp(uint256 tokenId) public view returns (uint256) {
        if (!isStaked[tokenId] || level[tokenId] >= MAX_LEVEL) {
            return 0;
        }
        uint256 nextLevelUpTime = stakingStartTime[tokenId] + TIME_PER_LEVEL;
        if (block.timestamp >= nextLevelUpTime) {
            return 0;
        } else {
            return nextLevelUpTime - block.timestamp;
        }
    }
} 