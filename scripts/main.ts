import { ethers } from "hardhat";

async function main() {
    const [deployer, addr1, addr2] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Load ERC20 token contract
    const ERC20TokenFactory = await ethers.getContractFactory("ERC20Token");
    const erc20impl = await ERC20TokenFactory.deploy("ERC20Token", "MTK", 18, 1000000);

    // Mint tokens
    const amountToMint = ethers.parseEther("100");
    await erc20impl.mint(addr1.address, amountToMint);

    // Burn tokens
    const amountToBurn = ethers.parseEther("50");
    await erc20impl.burn(amountToBurn);

    // Transfer tokens
    const amountToTransfer = ethers.parseEther("10");
    await erc20impl.transfer(addr2.address, amountToTransfer);

    console.log("Minted 100 tokens to", addr1.address);
    console.log("Burned 50 tokens");
    console.log("Transferred 10 tokens to", addr2.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
