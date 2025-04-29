# Asset-to-Asset (A2A) Transfer Module

The A2A Transfer Module enables cross-platform asset transfers between different blockchain ecosystems for the Eqic Game platform.

## Features

- Transfer NFT assets between multiple blockchain platforms
- Support for Solana, Ethereum, Polygon, ImmutableX, and Flow
- Queue management for transfer requests
- Fee calculation based on asset value and platform characteristics
- Transaction history tracking
- Compatibility checking between platforms

## Usage Example

```javascript
const { A2ATransfer, A2APlatforms } = require('./scripts/a2a');

// Initialize the transfer system
const transferSystem = new A2ATransfer();
await transferSystem.init({ feePercentage: 1.2 });

// Check platform compatibility
const compatibility = A2APlatforms.checkTransferCompatibility('solana', 'ethereum');
console.log('Transfer compatibility:', compatibility);

// Get platform information
const platforms = A2APlatforms.getAllPlatforms(true);
console.log('Supported platforms:', platforms.length);

// Create a transfer request
const transfer = await transferSystem.createTransfer({
  sourcePlatform: 'solana',
  targetPlatform: 'ethereum',
  assets: [
    { id: 'asset-123', type: 'character', value: 50 },
    { id: 'asset-456', type: 'item', value: 25 }
  ],
  wallet: { address: '0x123...abc' }
});

console.log('Transfer created:', transfer.id);

// Process the transfer
const result = await transferSystem.processTransfer(transfer.id);
console.log('Transfer complete:', result.transactionHash);

// Get transfer history
const history = transferSystem.getTransferHistory('0x123...abc');
console.log('Transfer history count:', history.length);
```

## API Reference

### A2ATransfer

- `init(config)` - Initialize the transfer system with configuration
- `createTransfer(params)` - Create a new transfer request
- `processTransfer(transferId)` - Process a pending transfer
- `getTransferHistory(walletAddress)` - Get transfer history for a wallet
- `getPendingTransfers(walletAddress)` - Get pending transfers for a wallet

### A2APlatforms

- `getAllPlatforms(activeOnly)` - Get all supported platforms
- `getPlatform(platformId)` - Get a specific platform by ID
- `checkTransferCompatibility(sourcePlatform, targetPlatform)` - Check if transfer is possible
- `updatePlatform(platformId, platformData)` - Update platform information 