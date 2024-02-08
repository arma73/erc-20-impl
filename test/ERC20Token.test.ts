import { ethers } from "hardhat";
import { expect } from "chai";

import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import type { ERC20Token, ERC20Token__factory } from "../types";

describe("ERC20Token", function () {
    let ERC20TokenFactory: ERC20Token__factory;
    let erc20impl: ERC20Token;
    let owner: HardhatEthersSigner;
    let addr1: HardhatEthersSigner;
    let addr2: HardhatEthersSigner;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        ERC20TokenFactory = await ethers.getContractFactory("ERC20Token");
        erc20impl = await ERC20TokenFactory.deploy(
            "ERC20Token",
            "MTK",
            18,
            1000000
        );
    });

    it("Should return the correct name, symbol, and decimals", async function () {
        expect(await erc20impl.name()).to.equal("ERC20Token");
        expect(await erc20impl.symbol()).to.equal("MTK");
        expect(await erc20impl.decimals()).to.equal(18);
    });

    it("Should return total supply", async function () {
        const expected = BigInt(1000000) * BigInt(10 ** 18);
        expect(await erc20impl.totalSupply()).to.equal(expected);
    });

    it("Should transfer tokens between accounts", async function () {
        await erc20impl.transfer(addr1.address, 100);
        expect(await erc20impl.balanceOf(addr1.address)).to.equal(100);

        await erc20impl.connect(addr1).transfer(addr2.address, 50);
        expect(await erc20impl.balanceOf(addr2.address)).to.equal(50);
    });

    it("Should fail if sender does not have enough tokens", async function () {
        const initialOwnerBalance = await erc20impl.balanceOf(owner.address);
        await expect(
            erc20impl.connect(addr1).transfer(owner.address, 1)
        ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
        expect(await erc20impl.balanceOf(owner.address)).to.equal(
            initialOwnerBalance
        );
    });

    it("Should update allowance correctly", async function () {
        await erc20impl.approve(addr1.address, 100);
        expect(
            await erc20impl.allowance(owner.address, addr1.address)
        ).to.equal(100);

        await erc20impl.approve(addr1.address, 0);
        expect(
            await erc20impl.allowance(owner.address, addr1.address)
        ).to.equal(0);
    });

    it("Should transfer tokens from one account to another by approved spender", async function () {
        await erc20impl.approve(addr1.address, 100);
        await erc20impl
            .connect(addr1)
            .transferFrom(owner.address, addr2.address, 100);
        expect(await erc20impl.balanceOf(addr2.address)).to.equal(100);
    });

    it("Should fail if spender does not have enough allowance", async function () {
        await erc20impl.approve(addr1.address, 100);
        await expect(
            erc20impl
                .connect(addr2)
                .transferFrom(owner.address, addr2.address, 101)
        ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
    });

    it("Should mint new tokens", async function () {
        await erc20impl.mint(addr1.address, 100);
        expect(await erc20impl.balanceOf(addr1.address)).to.equal(100);
    });

    it("Should burn tokens", async function () {
        const expected = (BigInt(1000000) * BigInt(10 ** 18)) - BigInt(100);
        await erc20impl.burn(100);
        expect(await erc20impl.balanceOf(owner.address)).to.equal(expected);
    });
});
