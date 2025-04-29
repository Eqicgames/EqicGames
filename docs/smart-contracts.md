# Eqic Games Smart Contracts Reference

This document provides a comprehensive overview of the smart contracts that power the Eqic Games platform. Our contracts are built on Solana for high performance and low fees.

## Contract Architecture

The Eqic Games platform uses a modular contract architecture:

```
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │     │                   │
│    EqicToken      │     │    GameAsset      │     │  GameMarketplace  │
│   (EQIC Token)    │     │  (Asset NFTs)     │     │  (Trading)        │
│                   │     │                   │     │                   │
└─────────┬─────────┘     └─────────┬─────────┘     └─────────┬─────────┘
          │                         │                         │
          │                         │                         │
          ▼                         ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                        MCP Protocol (Core Logic)                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## EqicToken Contract

The EqicToken (EQIC) is the native utility token of the Eqic Games ecosystem.

### Token Distribution

- Total Supply: 1,000,000,000 EQIC (1 billion tokens)
- Community Allocation: 50% (500,000,000 EQIC)
- Ecosystem Fund: 20% (200,000,000 EQIC)
- Team Allocation: 10% (100,000,000 EQIC) - vested over 2 years
- Investors: 10% (100,000,000 EQIC)
- Marketing: 5% (50,000,000 EQIC)
- Rewards Pool: 5% (50,000,000 EQIC)

### Key Functions

```solidity
// Release vested tokens for team allocation
function releaseTeamTokens() public

// Execute buyback and burn mechanism
function executeBuyback(uint256 amount) external
```

### Token Utility

- Platform transaction fees
- Staking rewards
- Governance voting
- Access to premium features
- Game asset purchases

## GameAsset Contract

Manages the creation, ownership, and transfer of in-game assets as NFTs.

### Asset Types

- `character`: Game characters, avatars, and playable entities
- `item`: Weapons, armor, consumables, and other inventory items
- `environment`: Land parcels, buildings, and decorative elements
- `collectible`: Cards, badges, and other collectibles

### Rarity Levels

- `common`: 60% probability
- `uncommon`: 25% probability
- `rare`: 10% probability
- `epic`: 4% probability
- `legendary`: 1% probability

### Key Functions

```solidity
// Register a new game
function registerGame(string memory gameId) external

// Create a new asset
function createAsset(
    string memory assetId,
    string memory name,
    string memory assetType,
    string memory rarity,
    string memory metadataURI,
    string memory gameId,
    bool isTransferable
) external

// Transfer an asset to another user
function transferAsset(string memory assetId, address to) external

// Update asset metadata
function updateAssetMetadata(string memory assetId, string memory metadataURI) external
```

### Querying Functions

```solidity
// Get asset details
function getAsset(string memory assetId) external view returns (Asset memory)

// Get all assets owned by a user
function getUserAssets(address user) external view returns (string[] memory)

// Get all assets for a game
function getGameAssets(string memory gameId) external view returns (string[] memory)
```

## GameMarketplace Contract

Facilitates the buying, selling, and trading of game assets.

### Key Features

- Direct sales listings
- Timed auctions
- Offers/bids on assets
- Platform fee (2.5%)
- Royalties for original creators

### Key Functions

```solidity
// List an asset for sale
function listAsset(string memory assetId, uint256 price) external

// Remove an asset listing
function unlistAsset(string memory assetId) external

// Buy a listed asset
function buyAsset(string memory assetId) external payable

// Make an offer for an asset
function makeOffer(string memory assetId, uint256 expirationTime) external payable

// Cancel an offer
function cancelOffer(string memory assetId, uint256 offerIndex) external

// Accept an offer
function acceptOffer(string memory assetId, uint256 offerIndex) external
```

### Admin Functions

```solidity
// Update platform fee percentage
function updatePlatformFee(uint256 newFeePercentage) external onlyOwner

// Update fee collector address
function updateFeeCollector(address newFeeCollector) external onlyOwner
```

## MCP Protocol Integration

The MCP (Metaverse Creation Protocol) provides a standardized framework for integrating traditional games with blockchain technology.

### Key Components

1. **Asset Registry**: Central registry mapping assets across games
2. **Transfer Mechanism**: Protocol for moving assets between games
3. **Validation System**: Ensures assets meet recipient game requirements

### Integration Example

```solidity
// Example of transferring an asset between games using MCP
function transferAssetToGame(string memory assetId, string memory targetGameId) external {
    // Verify ownership
    require(isAssetOwner(assetId, msg.sender), "Not the asset owner");
    
    // Check if target game exists and is active
    require(isGameActive(targetGameId), "Target game is not active");
    
    // Prepare asset data for transfer
    bytes memory assetData = prepareAssetForTransfer(assetId, targetGameId);
    
    // Execute transfer through MCP
    mcpRegistry.executeTransfer(assetId, targetGameId, assetData);
    
    // Emit transfer event
    emit AssetTransferredToGame(assetId, msg.sender, targetGameId);
}
```

## Security Considerations

### Audit Status

All contracts have undergone comprehensive security audits by:
- CertiK (March 2023)
- Quantstamp (May 2023)
- SlowMist (July 2023)

### Security Features

1. **Time-Locked Administration**: Critical parameter changes require a time delay
2. **Emergency Shutdown**: Ability to pause functionality in case of critical vulnerabilities
3. **Upgradability**: Proxy pattern for contract upgrades without data loss
4. **Multisig Control**: Admin operations require multiple signatures

## Contract Addresses

### Mainnet (Solana)

| Contract | Address | Explorer Link |
|----------|---------|---------------|
| EqicToken | `7uVQLP7N2BcEWHwE6zxN7Z8XuqJHZQJxaL5Wigm4cqXk` | [View on Solscan](https://solscan.io/token/7uVQLP7N2BcEWHwE6zxN7Z8XuqJHZQJxaL5Wigm4cqXk) |
| GameAsset | `GAmEAstD3LK1Hp6Q9CTcXuKN9YRfFbFdyyMLrKmYv12X` | [View on Solscan](https://solscan.io/account/GAmEAstD3LK1Hp6Q9CTcXuKN9YRfFbFdyyMLrKmYv12X) |
| GameMarketplace | `MPcT4XhEZwNjKdF3AcXRGuPjHFapJfVWz1xUHGzoLm4` | [View on Solscan](https://solscan.io/account/MPcT4XhEZwNjKdF3AcXRGuPjHFapJfVWz1xUHGzoLm4) |
| MCPRegistry | `MCPrgxxxxVTJLXmS8JfwxvfRz76Siq9JRXzGCdPrW` | [View on Solscan](https://solscan.io/account/MCPrgxxxxVTJLXmS8JfwxvfRz76Siq9JRXzGCdPrW) |

### Devnet (Solana)

| Contract | Address | Explorer Link |
|----------|---------|---------------|
| EqicToken | `DevEQic111111111111111111111111111111111111` | [View on Solscan](https://solscan.io/token/DevEQic111111111111111111111111111111111111?cluster=devnet) |
| GameAsset | `GameDevAst22222222222222222222222222222222` | [View on Solscan](https://solscan.io/account/GameDevAst22222222222222222222222222222222?cluster=devnet) |
| GameMarketplace | `MKtDevPLC33333333333333333333333333333333` | [View on Solscan](https://solscan.io/account/MKtDevPLC33333333333333333333333333333333?cluster=devnet) |
| MCPRegistry | `MCPDevReg44444444444444444444444444444444` | [View on Solscan](https://solscan.io/account/MCPDevReg44444444444444444444444444444444?cluster=devnet) |

## Developer Resources

- [GitHub Repository](https://github.com/EqicGames/contracts)
- [SDK Documentation](https://docs.eqicgame.world/sdk)
- [Technical Whitepaper](https://eqicgame.world/whitepaper.pdf)

## Contract Interactions

The following diagram illustrates the typical interaction flow between contracts:

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │         │             │         │             │
│    User     │         │  Frontend   │         │  Backend    │
│             │         │             │         │             │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │                       │                       │
       ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                        Blockchain                           │
│                                                             │
├─────────────┬─────────────┬─────────────┬─────────────┬─────┘
│             │             │             │             │
▼             ▼             ▼             ▼             ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│             │  │             │  │             │  │             │
│ EqicToken   │  │ GameAsset   │  │ Marketplace │  │ MCPRegistry │
│             │  │             │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

For more detailed information, please contact our developer support at developers@eqicgame.world. 