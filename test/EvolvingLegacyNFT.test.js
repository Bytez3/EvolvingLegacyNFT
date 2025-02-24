const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("EvolvingLegacyNFT", function () {
  let nft;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const EvolvingLegacyNFT = await ethers.getContractFactory("EvolvingLegacyNFT");
    nft = await EvolvingLegacyNFT.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await nft.name()).to.equal("EvolvingLegacyNFT");
      expect(await nft.symbol()).to.equal("ELNFT");
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint NFTs", async function () {
      await nft.mint(addr1.address, 1);
      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.getLevel(0)).to.equal(1);
    });

    it("Should not allow non-owner to mint", async function () {
      await expect(
        nft.connect(addr1).mint(addr1.address, 1)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Staking and Leveling", function () {
    beforeEach(async function () {
      await nft.mint(addr1.address, 1);
    });

    it("Should allow owner to stake NFT", async function () {
      await nft.connect(addr1).stake(0);
      expect(await nft.isStaked(0)).to.be.true;
    });

    it("Should not allow non-owner to stake NFT", async function () {
      await expect(
        nft.connect(addr2).stake(0)
      ).to.be.revertedWith("Not owner");
    });

    it("Should level up after staking period", async function () {
      await nft.connect(addr1).stake(0);
      await time.increase(7 * 24 * 60 * 60); // 7 days
      await nft.connect(addr1).levelUp(0);
      expect(await nft.getLevel(0)).to.equal(2);
    });

    it("Should not level up before staking period", async function () {
      await nft.connect(addr1).stake(0);
      await time.increase(3 * 24 * 60 * 60); // 3 days
      await expect(
        nft.connect(addr1).levelUp(0)
      ).to.be.revertedWith("Too early");
    });

    it("Should not allow transfer of staked NFT", async function () {
      await nft.connect(addr1).stake(0);
      await expect(
        nft.connect(addr1).transferFrom(addr1.address, addr2.address, 0)
      ).to.be.revertedWith("Token is staked");
    });

    it("Should allow transfer after unstaking", async function () {
      await nft.connect(addr1).stake(0);
      await nft.connect(addr1).unstake(0);
      await nft.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
      expect(await nft.ownerOf(0)).to.equal(addr2.address);
    });
  });

  describe("Metadata", function () {
    beforeEach(async function () {
      await nft.mint(addr1.address, 1);
      await nft.setBaseURI("https://api.example.com/metadata/");
    });

    it("Should return correct token URI", async function () {
      expect(await nft.tokenURI(0)).to.equal("https://api.example.com/metadata/0_1.json");
    });

    it("Should update token URI after level up", async function () {
      await nft.connect(addr1).stake(0);
      await time.increase(7 * 24 * 60 * 60);
      await nft.connect(addr1).levelUp(0);
      expect(await nft.tokenURI(0)).to.equal("https://api.example.com/metadata/0_2.json");
    });
  });
}); 