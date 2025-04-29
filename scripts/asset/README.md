# Asset Generation Module

This module provides a comprehensive solution for generating NFT-based game assets for the Eqic Game platform.

## Features

- Generate individual or batch assets with customizable properties
- Support for multiple asset types: character, item, environment, collectible
- Five rarity levels with appropriate attribute scaling (common, uncommon, rare, epic, legendary)
- Random attribute generation with rarity-based scaling
- Unique ID generation for each asset
- Structured metadata suitable for NFT integration
- Configurable rarity distribution for batch generation

## API Reference

### `AssetGenerator`

The main class for generating game assets.

#### Methods

##### `generateAsset(options)`
Generate a single asset with the specified options.

Parameters:
- `options` (Object):
  - `assetType` (String): Type of asset (character, item, environment, collectible)
  - `name` (String, optional): Custom name for the asset
  - `description` (String, optional): Description of the asset
  - `rarity` (String, optional): Rarity level (common, uncommon, rare, epic, legendary)
  - `attributes` (Object, optional): Custom attributes to override defaults

Returns: Promise resolving to a generated asset object

##### `generateBatch(options)`
Generate multiple assets in a batch.

Parameters:
- `options` (Object):
  - `count` (Number): Number of assets to generate
  - `assetType` (String): Type of assets to generate
  - `rarityDistribution` (Object, optional): Custom probability distribution for rarities
  - `baseAttributes` (Object, optional): Base attributes to be applied to all assets

Returns: Promise resolving to an array of generated asset objects

## Examples

### Generate a single character with specific attributes

```javascript
const generator = new AssetGenerator();

generator.generateAsset({
  assetType: 'character',
  name: 'Hero Knight',
  rarity: 'legendary',
  description: 'A legendary knight with unmatched combat skills',
  attributes: {
    strength: 95,
    agility: 80,
    intelligence: 70
  }
})
.then(asset => {
  console.log(asset);
});
```

### Generate a batch of items with custom rarity distribution

```javascript
const generator = new AssetGenerator();

generator.generateBatch({
  count: 100,
  assetType: 'item',
  rarityDistribution: {
    common: 0.6,
    uncommon: 0.25,
    rare: 0.1,
    epic: 0.04,
    legendary: 0.01
  }
})
.then(items => {
  // Process generated items
  const legendaryItems = items.filter(item => item.rarity === 'legendary');
  console.log(`Generated ${legendaryItems.length} legendary items`);
});
``` 