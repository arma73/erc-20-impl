# ERC20 Token Implementation

This project implements the ERC20 standard token in Solidity.

## Contract

The `ERC20Token.sol` file contains the implementation of the ERC20Token contract.

## Tests

The `ERC20Token.test.ts` file contains tests to ensure the functionality and security of the ERC20Token contract. It tests the name, symbol, decimals, minting, burning, and transferring of tokens.

## Scripts

Three scripts are provided to interact with the ERC20Token contract:
- `main.ts`: Mint, Burn and Transfer Scripts

## Usage

### Deploy Contract

1. Install dependencies: `npm install`
2. Gen Types: `npm run typechain`
3. Compile contracts: `npx hardhat compile`
4. Deploy contract: `npx hardhat run scripts/main.ts`

### Run Tests

Run tests using Hardhat: `npx hardhat test`

### Run Scripts

Run scripts to interact with the deployed contract:
- Mint, Burn, Transfer tokens: `npx hardhat run scripts/main.ts`
