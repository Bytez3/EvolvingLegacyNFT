# Evolving Legacy NFT

A unique NFT collection on Base network that implements a "stake to reveal" mechanism where NFTs evolve over time based on staking duration. Each NFT can level up every 7 days while staked, reaching a maximum level of 10.

## Features

- ERC721A implementation for gas-efficient minting
- Stake-to-evolve mechanism
- Level up system (max level: 10)
- 7-day staking period per level
- Dynamic metadata based on NFT level
- Transfer restrictions for staked NFTs

## Smart Contract

The smart contract is deployed on Base network and includes the following key functionalities:

- Minting new NFTs (owner only)
- Staking NFTs to start evolution
- Leveling up after staking period
- Unstaking NFTs
- View functions for level and time until next level
- Dynamic metadata URIs based on current level

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- A wallet with Base network tokens for deployment
- Base RPC URL (Mainnet/Testnet)
- Basescan API Key (for contract verification)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd evolving-legacy-nft
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Fill in your environment variables in `.env`:
```bash
BASE_GOERLI_RPC_URL=your_base_goerli_rpc_url
BASE_MAINNET_RPC_URL=your_base_mainnet_rpc_url
PRIVATE_KEY=your_private_key
BASESCAN_API_KEY=your_basescan_api_key
METADATA_BASE_URI=your_metadata_base_uri
```

## Testing

Run the test suite:
```bash
npx hardhat test
```

## Deployment

1. To deploy to Base Goerli testnet:
```bash
npx hardhat run scripts/deploy.js --network base-goerli
```

2. To deploy to Base mainnet:
```bash
npx hardhat run scripts/deploy.js --network base-mainnet
```

## Contract Interaction

After deployment, you can interact with the contract using the following functions:

### For Contract Owner
- `mint(address to, uint256 quantity)`: Mint new NFTs
- `setBaseURI(string baseURI_)`: Set the base URI for metadata

### For NFT Holders
- `stake(uint256 tokenId)`: Stake an NFT to start evolution
- `levelUp(uint256 tokenId)`: Level up NFT after staking period
- `unstake(uint256 tokenId)`: Unstake an NFT

### View Functions
- `getLevel(uint256 tokenId)`: Get current level of NFT
- `timeUntilNextLevelUp(uint256 tokenId)`: Get time remaining until next level
- `isStaked(uint256 tokenId)`: Check if NFT is staked
- `tokenURI(uint256 tokenId)`: Get metadata URI for NFT

## Metadata Format

The metadata JSON files should follow this format:
```json
{
  "name": "Evolving Legacy NFT #<tokenId>",
  "description": "Level <level> Evolving Legacy NFT",
  "image": "<image_url>",
  "attributes": [
    {
      "trait_type": "Level",
      "value": <level>
    },
    {
      "trait_type": "Staked",
      "value": <true/false>
    }
  ]
}
```

## Scripts

### Generate Metadata
To generate metadata for your NFTs:
```bash
node scripts/generate-metadata.js
```

### Contract Interaction Script
To interact with the deployed contract:
1. Update the contract address in `scripts/interact.js`
2. Uncomment the desired interactions
3. Run:
```bash
npx hardhat run scripts/interact.js --network base-goerli
```

## Development

To add new features or modify the contract:

1. Modify the contract in `contracts/EvolvingLegacyNFT.sol`
2. Update tests in `test/EvolvingLegacyNFT.test.js`
3. Run tests to ensure everything works:
```bash
npx hardhat test
```
4. Deploy the updated contract using the deployment script

## Security Considerations

- The contract uses OpenZeppelin's `Ownable` for access control
- Staked NFTs cannot be transferred
- Level-up requirements are enforced by the contract
- Time-based mechanics use block timestamps

## License

MIT License
