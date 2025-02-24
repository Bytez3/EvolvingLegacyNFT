# Evolving Legacy NFT

A unique NFT collection on Base network that implements a "stake to reveal" mechanism where NFTs evolve over time based on staking duration. Each NFT can level up every 7 days while staked, reaching a maximum level of 10, with each level providing increased power and new visual attributes.

## Features

- ERC721A implementation for gas-efficient minting
- Stake-to-evolve mechanism with 7-day evolution periods
- Progressive level system (max level: 10)
- Evolution stages: Novice → Adept → Master → Legend
- Power boost system (10% increase per level)
- Dynamic metadata and visuals based on NFT level
- Transfer restrictions for staked NFTs
- Gas-optimized contract design

## Evolution Mechanics

### Leveling System
- Each NFT starts at Level 1
- NFTs must be staked to begin evolution
- Evolution occurs every 7 days of continuous staking
- Maximum level cap of 10
- Each level provides a 10% power boost

### Evolution Stages
1. **Novice** (Levels 1-3)
   - Initial evolution stage
   - Basic power capabilities
   
2. **Adept** (Levels 4-6)
   - Intermediate evolution
   - Enhanced attributes
   
3. **Master** (Levels 7-9)
   - Advanced evolution
   - Superior capabilities
   
4. **Legend** (Level 10)
   - Final evolution stage
   - Maximum power achieved

## Smart Contract

The smart contract is deployed on Base network and includes the following key functionalities:

### Owner Functions
- `mint(address to, uint256 quantity)`: Mint new NFTs
- `setBaseURI(string baseURI_)`: Set the base URI for metadata

### User Functions
- `stake(uint256 tokenId)`: Start the evolution process
- `levelUp(uint256 tokenId)`: Evolve NFT after staking period
- `unstake(uint256 tokenId)`: Stop evolution process
- `getLevel(uint256 tokenId)`: Check current level
- `timeUntilNextLevelUp(uint256 tokenId)`: View remaining time
- `isStaked(uint256 tokenId)`: Check staking status

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- A wallet with Base network tokens for deployment
- Base RPC URL (Mainnet/Testnet)
- Basescan API Key (for contract verification)
- IPFS account for metadata storage (recommended)

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

## Development Workflow

### 1. Testing
Run the comprehensive test suite:
```bash
npm test
```

### 2. Compile Contracts
```bash
npm run compile
```

### 3. Generate Metadata
```bash
npm run generate-metadata
```

### 4. Deploy Contract
To Base Goerli testnet:
```bash
npm run deploy:goerli
```

To Base mainnet:
```bash
npm run deploy:mainnet
```

### 5. Verify Contract
```bash
npm run verify <contract-address> --network base-goerli
```

## Metadata Structure

The metadata follows the OpenSea standard with additional evolution-specific attributes:

```json
{
  "name": "Evolving Legacy NFT #<tokenId>",
  "description": "Level <level> Evolving Legacy NFT - A unique NFT that evolves through staking",
  "image": "ipfs://<CID>/<tokenId>_<level>.png",
  "attributes": [
    {
      "trait_type": "Level",
      "value": "<level>",
      "max_value": 10
    },
    {
      "trait_type": "Evolution Stage",
      "value": "<Novice/Adept/Master/Legend>"
    },
    {
      "display_type": "boost_percentage",
      "trait_type": "Power Boost",
      "value": "<level * 10>"
    }
  ]
}
```

## Scripts

### Generate Metadata
Generates metadata files for all NFTs at each level:
```bash
npm run generate-metadata
```

### Contract Interaction
To interact with the deployed contract:
1. Update `YOUR_CONTRACT_ADDRESS` in `scripts/interact.js`
2. Use the provided functions in the script
3. Run:
```bash
npx hardhat run scripts/interact.js --network base-goerli
```

## Security Considerations

- **Access Control**: OpenZeppelin's `Ownable` pattern for admin functions
- **Staking Security**: NFTs cannot be transferred while staked
- **Evolution Verification**: Level-up requirements strictly enforced on-chain
- **Time Manipulation**: Block timestamps used with appropriate safety margins
- **Gas Optimization**: ERC721A for efficient minting and transfers

## Best Practices

1. **Before Deployment**
   - Run full test suite
   - Generate and upload all metadata to IPFS
   - Verify gas costs for all operations

2. **After Deployment**
   - Verify contract on Basescan
   - Test all functions on testnet
   - Set proper base URI
   - Document contract address

3. **Maintenance**
   - Monitor staking activity
   - Track evolution progress
   - Backup metadata and images

## Troubleshooting

Common issues and solutions:

1. **Staking Issues**
   - Verify NFT ownership
   - Check if NFT is already staked
   - Ensure proper approval

2. **Level Up Failures**
   - Confirm staking duration requirement
   - Check current level vs max level
   - Verify caller is NFT owner

3. **Metadata Issues**
   - Verify base URI is set correctly
   - Check IPFS gateway status
   - Confirm metadata file format

## License

MIT License
