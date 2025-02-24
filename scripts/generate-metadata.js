const fs = require('fs');
const path = require('path');

// Configuration
const TOTAL_NFTS = 100; // Total number of NFTs to generate metadata for
const MAX_LEVEL = 10;   // Maximum level an NFT can reach
const OUTPUT_DIR = path.join(__dirname, '../metadata');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate metadata for each NFT at each possible level
function generateMetadata(tokenId, level) {
  return {
    name: `Evolving Legacy NFT #${tokenId}`,
    description: `Level ${level} Evolving Legacy NFT - A unique NFT that evolves through staking`,
    image: `ipfs://YOUR_IPFS_CID/${tokenId}_${level}.png`, // Replace YOUR_IPFS_CID with actual CID
    attributes: [
      {
        trait_type: "Level",
        value: level,
        max_value: MAX_LEVEL
      },
      {
        trait_type: "Evolution Stage",
        value: getEvolutionStage(level)
      },
      {
        display_type: "boost_percentage",
        trait_type: "Power Boost",
        value: calculatePowerBoost(level)
      }
    ]
  };
}

// Helper function to determine evolution stage based on level
function getEvolutionStage(level) {
  if (level <= 3) return "Novice";
  if (level <= 6) return "Adept";
  if (level <= 9) return "Master";
  return "Legend";
}

// Helper function to calculate power boost based on level
function calculatePowerBoost(level) {
  return level * 10; // Each level gives 10% boost
}

// Generate metadata files
async function generateAllMetadata() {
  console.log("Generating metadata files...");

  for (let tokenId = 0; tokenId < TOTAL_NFTS; tokenId++) {
    for (let level = 1; level <= MAX_LEVEL; level++) {
      const metadata = generateMetadata(tokenId, level);
      const fileName = path.join(OUTPUT_DIR, `${tokenId}_${level}.json`);
      
      fs.writeFileSync(
        fileName,
        JSON.stringify(metadata, null, 2)
      );
    }
    
    if (tokenId % 10 === 0) {
      console.log(`Generated metadata for token ${tokenId}`);
    }
  }

  console.log("Metadata generation complete!");
}

// Run the script
generateAllMetadata()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error generating metadata:", error);
    process.exit(1);
  }); 