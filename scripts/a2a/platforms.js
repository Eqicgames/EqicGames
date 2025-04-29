/**
 * A2A Platforms Module
 * Defines supported platforms for the Asset-to-Asset transfer system
 */

class A2APlatforms {
  constructor() {
    this.platforms = {
      solana: {
        name: 'Solana',
        icon: 'solana-logo.svg',
        description: 'High-performance blockchain with low transaction costs',
        transferFee: 0.5,
        estimatedTime: '< 1 minute',
        supported: true,
        testnet: true,
        mainnet: true
      },
      ethereum: {
        name: 'Ethereum',
        icon: 'ethereum-logo.svg',
        description: 'Established blockchain with strong security and widespread adoption',
        transferFee: 2.0,
        estimatedTime: '5-10 minutes',
        supported: true,
        testnet: true,
        mainnet: true
      },
      polygon: {
        name: 'Polygon',
        icon: 'polygon-logo.svg',
        description: 'Ethereum scaling solution with fast and inexpensive transactions',
        transferFee: 0.8,
        estimatedTime: '1-2 minutes',
        supported: true,
        testnet: true,
        mainnet: true
      },
      immutablex: {
        name: 'ImmutableX',
        icon: 'immutablex-logo.svg',
        description: 'Layer 2 scaling solution for NFTs with zero gas fees',
        transferFee: 1.0,
        estimatedTime: '1-3 minutes',
        supported: true,
        testnet: true,
        mainnet: false
      },
      flow: {
        name: 'Flow',
        icon: 'flow-logo.svg',
        description: 'Developer-friendly blockchain built for games and digital assets',
        transferFee: 1.2,
        estimatedTime: '2-4 minutes',
        supported: true,
        testnet: true,
        mainnet: false
      }
    };
  }

  /**
   * Get all supported platforms
   * @param {Boolean} activeOnly - Only return active platforms
   * @returns {Array} - Array of platform objects
   */
  getAllPlatforms(activeOnly = false) {
    if (activeOnly) {
      return Object.entries(this.platforms)
        .filter(([_, platform]) => platform.supported)
        .map(([key, platform]) => ({
          id: key,
          ...platform
        }));
    }
    
    return Object.entries(this.platforms).map(([key, platform]) => ({
      id: key,
      ...platform
    }));
  }

  /**
   * Get a specific platform by ID
   * @param {String} platformId - Platform identifier
   * @returns {Object|null} - Platform object or null if not found
   */
  getPlatform(platformId) {
    if (!this.platforms[platformId]) {
      return null;
    }
    
    return {
      id: platformId,
      ...this.platforms[platformId]
    };
  }

  /**
   * Check if direct transfer is possible between two platforms
   * @param {String} sourcePlatform - Source platform ID
   * @param {String} targetPlatform - Target platform ID
   * @returns {Object} - Transfer compatibility information
   */
  checkTransferCompatibility(sourcePlatform, targetPlatform) {
    const source = this.platforms[sourcePlatform];
    const target = this.platforms[targetPlatform];
    
    if (!source || !target) {
      return {
        compatible: false,
        reason: 'One or both platforms not found'
      };
    }
    
    if (!source.supported || !target.supported) {
      return {
        compatible: false,
        reason: 'One or both platforms not currently supported'
      };
    }
    
    // Some platforms might require bridge transfers
    const requiresBridge = (
      (sourcePlatform === 'solana' && targetPlatform === 'flow') ||
      (sourcePlatform === 'flow' && targetPlatform === 'solana')
    );
    
    // Calculate estimated fees
    const baseFee = source.transferFee + target.transferFee * 0.5;
    const bridgeFee = requiresBridge ? 1.5 : 0;
    const totalFee = baseFee + bridgeFee;
    
    // Calculate estimated time
    let estimatedTime = '5-15 minutes';
    if (requiresBridge) {
      estimatedTime = '15-30 minutes';
    } else if (sourcePlatform === targetPlatform) {
      estimatedTime = '< 5 minutes';
    }
    
    return {
      compatible: true,
      requiresBridge,
      estimatedFee: totalFee,
      estimatedTime,
      notes: requiresBridge ? 'Requires bridge transfer between networks' : ''
    };
  }

  /**
   * Update platform information
   * @param {String} platformId - Platform to update
   * @param {Object} platformData - New platform data
   * @returns {Boolean} - Success status
   */
  updatePlatform(platformId, platformData) {
    if (!this.platforms[platformId]) {
      return false;
    }
    
    this.platforms[platformId] = {
      ...this.platforms[platformId],
      ...platformData
    };
    
    return true;
  }
}

module.exports = new A2APlatforms(); 