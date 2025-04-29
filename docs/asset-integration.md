# Game Asset Integration Guide

This guide provides detailed instructions for integrating the Eqic Games MCP (Metaverse Creation Protocol) into existing games to enable blockchain asset functionality.

## Overview

The MCP enables traditional games to seamlessly connect with blockchain technology, allowing for:

- True ownership of in-game assets
- Cross-game asset transfers
- Player-to-player trading
- Verifiable rarity and uniqueness
- Creator royalties

## Integration Process

### Step 1: Setup SDK

Install the Eqic Games SDK:

```bash
# NPM
npm install @eqic/game-sdk

# Yarn
yarn add @eqic/game-sdk
```

Initialize the SDK in your game:

```javascript
// Initialize the SDK
import { EqicSDK } from '@eqic/game-sdk';

const eqicSDK = new EqicSDK({
  gameId: 'your-registered-game-id',
  environment: 'production', // or 'development'
  apiKey: 'your-api-key'
});

// Initialize when your game loads
await eqicSDK.init();
```

### Step 2: Define Asset Structure

Create a schema for your game's assets:

```javascript
// Example asset schema for a weapon
const weaponSchema = {
  assetType: 'weapon',
  properties: {
    damage: {
      type: 'number',
      min: 1,
      max: 100
    },
    durability: {
      type: 'number',
      min: 1,
      max: 1000
    },
    level: {
      type: 'number',
      min: 1,
      max: 50
    },
    elementType: {
      type: 'string',
      enum: ['fire', 'water', 'earth', 'air', 'none']
    }
  },
  rarityLevels: [
    { name: 'common', probability: 0.6, modifiers: { damage: 1, durability: 1 } },
    { name: 'uncommon', probability: 0.25, modifiers: { damage: 1.2, durability: 1.1 } },
    { name: 'rare', probability: 0.1, modifiers: { damage: 1.5, durability: 1.2 } },
    { name: 'epic', probability: 0.04, modifiers: { damage: 2, durability: 1.5 } },
    { name: 'legendary', probability: 0.01, modifiers: { damage: 3, durability: 2 } }
  ]
};

// Register the schema with the SDK
await eqicSDK.registerAssetSchema('weapon', weaponSchema);
```

### Step 3: Asset Creation

When creating in-game assets that should be blockchain-enabled:

```javascript
// Create a new asset
const assetData = {
  name: 'Flaming Sword',
  assetType: 'weapon',
  properties: {
    damage: 50,
    durability: 800,
    level: 5,
    elementType: 'fire'
  },
  // Optional: specify rarity directly, otherwise system will calculate
  rarity: 'epic',
  // Optional: provide visual information
  visual: {
    model: 'sword_03',
    texture: 'fire_texture',
    scale: 1.2
  }
};

// Create the asset - this mints it on the blockchain
const asset = await eqicSDK.createAsset(assetData);

// Use the returned asset in your game
console.log(`Created asset with ID: ${asset.id}`);
```

### Step 4: Asset Retrieval & Rendering

Load player's assets when they log in:

```javascript
// Get all assets owned by the current player
const playerAssets = await eqicSDK.getPlayerAssets();

// Render assets in your game inventory
playerAssets.forEach(asset => {
  // Example: Add to player inventory
  playerInventory.addItem({
    id: asset.id,
    name: asset.name,
    type: asset.assetType,
    properties: asset.properties,
    rarity: asset.rarity,
    // Extract game-specific visual data
    modelId: asset.visual?.model || getDefaultModel(asset.assetType),
    textureId: asset.visual?.texture || getDefaultTexture(asset.assetType, asset.rarity)
  });
});
```

### Step 5: Implement Asset Transfer

Allow players to transfer assets between games:

```javascript
// UI event handler for when player wants to transfer an asset
async function transferAssetToOtherGame(assetId, targetGameId) {
  try {
    const result = await eqicSDK.transferAsset(assetId, targetGameId);
    
    if (result.success) {
      // Remove asset from player's inventory in current game
      playerInventory.removeItem(assetId);
      ui.showSuccessMessage('Asset transferred successfully');
    } else {
      ui.showErrorMessage(`Transfer failed: ${result.message}`);
    }
  } catch (error) {
    ui.showErrorMessage('Transfer failed. Please try again.');
    console.error(error);
  }
}
```

### Step 6: Implement Asset Reception

Handle assets transferred from other games:

```javascript
// Listen for incoming assets
eqicSDK.on('assetReceived', (asset) => {
  // Check if asset type is compatible with your game
  if (isAssetCompatible(asset)) {
    // Convert external asset to your game's format
    const gameAsset = convertToGameAsset(asset);
    
    // Add to player's inventory
    playerInventory.addItem(gameAsset);
    
    // Notify player
    ui.showNotification(`New item received: ${asset.name}`);
  } else {
    // Handle incompatible asset (store in special inventory, convert to in-game currency, etc.)
    handleIncompatibleAsset(asset);
  }
});

// Helper function to determine if asset is compatible
function isAssetCompatible(asset) {
  // Check if asset type is supported by your game
  return SUPPORTED_ASSET_TYPES.includes(asset.assetType);
}
```

## Advanced Integration

### Asset Mapping Between Games

Define how assets from other games map to assets in your game:

```javascript
// Register asset mapping rules
await eqicSDK.registerAssetMapping({
  sourceGame: 'game-a',
  sourceAssetType: 'vehicle',
  targetAssetType: 'mount',
  propertyMapping: {
    'speed': 'moveSpeed',
    'armor': 'defense',
    // If source property doesn't exist, use default
    'durability': { default: 100 },
    // Apply transformations to values
    'fuel': (value) => Math.min(value * 10, 1000)
  },
  visualMapping: {
    // Map source visuals to your game's assets
    models: {
      'car_01': 'horse_mount',
      'bike_02': 'wolf_mount',
      'default': 'basic_mount'
    }
  }
});
```

### Marketplace Integration

Allow players to buy and sell assets through the Eqic Marketplace:

```javascript
// List an asset for sale
async function listAssetForSale(assetId, price) {
  try {
    const listing = await eqicSDK.createListing({
      assetId,
      price,
      currency: 'SOL'
    });
    
    ui.showSuccessMessage(`Asset listed for ${price} SOL`);
    return listing;
  } catch (error) {
    ui.showErrorMessage('Failed to list asset');
    console.error(error);
  }
}

// Buy an asset
async function buyAsset(listingId) {
  try {
    const result = await eqicSDK.purchaseListing(listingId);
    
    if (result.success) {
      // Add asset to player's inventory
      playerInventory.addItem(convertToGameAsset(result.asset));
      ui.showSuccessMessage('Purchase successful!');
    } else {
      ui.showErrorMessage(`Purchase failed: ${result.message}`);
    }
  } catch (error) {
    ui.showErrorMessage('Purchase failed');
    console.error(error);
  }
}
```

## Best Practices

1. **Asset Balance**: Design assets to be balanced across games to prevent single game dominance

2. **Graceful Degradation**: Handle cases where blockchain services are temporarily unavailable

3. **Asset Verification**: Always verify asset validity before rendering in-game:

   ```javascript
   // Verify asset authenticity
   const isAuthentic = await eqicSDK.verifyAsset(assetId);
   if (!isAuthentic) {
     // Handle invalid asset
     return;
   }
   ```

4. **Performance Considerations**: Cache asset data to minimize blockchain calls:

   ```javascript
   // Implement caching for frequently accessed assets
   const assetCache = new Map();
   
   async function getAssetWithCache(assetId) {
     if (assetCache.has(assetId)) {
       return assetCache.get(assetId);
     }
     
     const asset = await eqicSDK.getAsset(assetId);
     assetCache.set(assetId, asset);
     return asset;
   }
   ```

5. **Progressive Enhancement**: Allow your game to function even if blockchain features are disabled

## Testing

We provide a sandbox environment for testing your integration:

1. Use `environment: 'development'` when initializing the SDK
2. Access the developer dashboard at https://developer.eqicgame.world
3. Generate test assets for your game
4. Use test wallets with pre-loaded balances

## Support

For technical support with your integration:

- Documentation: https://docs.eqicgame.world
- Developer Discord: https://discord.gg/eqicgames-dev
- Email: developers@eqicgame.world 