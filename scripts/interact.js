const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Interacting with contract using account:", deployer.address);

  // Get the contract instance
  const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your deployed contract address
  const EvolvingLegacyNFT = await hre.ethers.getContractFactory("EvolvingLegacyNFT");
  const nft = EvolvingLegacyNFT.attach(contractAddress);

  // Example interactions
  async function mintNFT(to, quantity) {
    console.log(`Minting ${quantity} NFT(s) to ${to}...`);
    const tx = await nft.mint(to, quantity);
    await tx.wait();
    console.log("Minting successful!");
  }

  async function stakeNFT(tokenId) {
    console.log(`Staking NFT #${tokenId}...`);
    const tx = await nft.stake(tokenId);
    await tx.wait();
    console.log("Staking successful!");
  }

  async function levelUpNFT(tokenId) {
    console.log(`Attempting to level up NFT #${tokenId}...`);
    const tx = await nft.levelUp(tokenId);
    await tx.wait();
    console.log("Level up successful!");
  }

  async function unstakeNFT(tokenId) {
    console.log(`Unstaking NFT #${tokenId}...`);
    const tx = await nft.unstake(tokenId);
    await tx.wait();
    console.log("Unstaking successful!");
  }

  async function getNFTInfo(tokenId) {
    const level = await nft.getLevel(tokenId);
    const isStaked = await nft.isStaked(tokenId);
    const timeUntilNextLevel = await nft.timeUntilNextLevelUp(tokenId);
    const uri = await nft.tokenURI(tokenId);

    console.log(`\nNFT #${tokenId} Info:`);
    console.log("Level:", level.toString());
    console.log("Staked:", isStaked);
    console.log("Time until next level (seconds):", timeUntilNextLevel.toString());
    console.log("Metadata URI:", uri);
  }

  // Example usage (uncomment and modify as needed):
  /*
  // Mint a new NFT
  await mintNFT(deployer.address, 1);

  // Stake NFT #0
  await stakeNFT(0);

  // Get NFT info
  await getNFTInfo(0);

  // Try to level up (will fail if not enough time has passed)
  await levelUpNFT(0);

  // Unstake NFT
  await unstakeNFT(0);
  */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 