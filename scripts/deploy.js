const hre = require("hardhat");

async function main() {
  console.log("Deploying EvolvingLegacyNFT contract...");

  const EvolvingLegacyNFT = await hre.ethers.getContractFactory("EvolvingLegacyNFT");
  const nft = await EvolvingLegacyNFT.deploy();

  await nft.waitForDeployment();
  const address = await nft.getAddress();

  console.log("EvolvingLegacyNFT deployed to:", address);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await nft.deploymentTransaction().wait(5);

  // Set initial base URI if provided in environment
  const baseURI = process.env.METADATA_BASE_URI;
  if (baseURI) {
    console.log("Setting base URI...");
    await nft.setBaseURI(baseURI);
    console.log("Base URI set to:", baseURI);
  }

  // Verify the contract
  console.log("Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.log("Error verifying contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 