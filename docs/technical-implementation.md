# Eqic Games Technical Implementation

This document provides a comprehensive overview of the technical implementation that powers the Eqic Games platform. Our system is built with modern JavaScript technologies for performance and scalability.

## System Architecture

The Eqic Games platform uses a modular architecture:

```
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │     │                   │
│    API Gateway    │     │   Asset Manager   │     │    Marketplace    │
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

## SDK Implementation

### Core SDK Class

The SDK provides the main interface for developers to interact with the Eqic platform:

```javascript
// src/sdk/EqicSDK.js
export class EqicSDK {
  constructor(options) {
    this.gameId = options.gameId;
    this.environment = options.environment || 'production';
    this.apiKey = options.apiKey;
    this.apiBase = this.environment === 'production' 
      ? 'https://api.eqicgame.world/v1' 
      : 'https://dev-api.eqicgame.world/v1';
    this.eventEmitter = new EventEmitter();
    this.initialized = false;
    this.walletConnection = null;
  }

  async init() {
    try {
      // Validate API key and game ID
      const validation = await this.validateCredentials();
      if (!validation.success) {
        throw new Error(`SDK initialization failed: ${validation.message}`);
      }

      // Setup event listeners for websocket
      this.setupEventListeners();
      
      // Connect to wallet if available
      await this.connectToWallet();
      
      this.initialized = true;
      return { success: true };
    } catch (error) {
      console.error('SDK Initialization error:', error);
      return { success: false, message: error.message };
    }
  }

  // Event handling
  on(event, callback) {
    this.eventEmitter.on(event, callback);
    return this;
  }

  off(event, callback) {
    this.eventEmitter.off(event, callback);
    return this;
  }

  // Asset management methods
  async getPlayerAssets() {
    this.checkInitialized();
    const response = await this.apiRequest('/assets/player', { method: 'GET' });
    return response.assets || [];
  }

  async createAsset(assetData) {
    this.checkInitialized();
    const response = await this.apiRequest('/assets', {
      method: 'POST',
      body: JSON.stringify(assetData)
    });
    return response;
  }

  async transferAsset(assetId, targetGameId) {
    this.checkInitialized();
    const response = await this.apiRequest(`/assets/${assetId}/transfer`, {
      method: 'POST',
      body: JSON.stringify({ targetGameId })
    });
    return response;
  }

  // Marketplace methods
  async createListing(listingData) {
    this.checkInitialized();
    const response = await this.apiRequest('/marketplace/listings', {
      method: 'POST',
      body: JSON.stringify(listingData)
    });
    return response;
  }

  async purchaseListing(listingId) {
    this.checkInitialized();
    const response = await this.apiRequest(`/marketplace/listings/${listingId}/purchase`, {
      method: 'POST'
    });
    return response;
  }

  // Helper methods
  checkInitialized() {
    if (!this.initialized) {
      throw new Error('SDK not initialized. Call init() first.');
    }
  }

  async apiRequest(path, options = {}) {
    const url = `${this.apiBase}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      'X-Game-ID': this.gameId
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  }
}
```

## Asset Management

### Asset Schema Definition

```javascript
// src/sdk/AssetSchema.js
export class AssetSchemaManager {
  constructor(sdk) {
    this.sdk = sdk;
    this.schemas = new Map();
  }

  async registerSchema(assetType, schema) {
    // Validate schema format
    this.validateSchema(schema);
    
    // Register with backend
    const response = await this.sdk.apiRequest('/schemas', {
      method: 'POST',
      body: JSON.stringify({
        assetType,
        schema
      })
    });
    
    // Store locally for validation
    this.schemas.set(assetType, schema);
    
    return response;
  }

  validateAsset(assetType, assetData) {
    const schema = this.schemas.get(assetType);
    if (!schema) {
      throw new Error(`No schema registered for asset type: ${assetType}`);
    }
    
    // Validate required properties
    for (const propName in schema.properties) {
      const propSchema = schema.properties[propName];
      const value = assetData.properties[propName];
      
      // Check required properties
      if (propSchema.required && (value === undefined || value === null)) {
        throw new Error(`Required property '${propName}' is missing`);
      }
      
      // Type validation
      if (value !== undefined && value !== null) {
        if (propSchema.type === 'number') {
          if (typeof value !== 'number') {
            throw new Error(`Property '${propName}' must be a number`);
          }
          
          // Range validation
          if (propSchema.min !== undefined && value < propSchema.min) {
            throw new Error(`Property '${propName}' must be at least ${propSchema.min}`);
          }
          
          if (propSchema.max !== undefined && value > propSchema.max) {
            throw new Error(`Property '${propName}' must be at most ${propSchema.max}`);
          }
        } else if (propSchema.type === 'string' && propSchema.enum) {
          if (!propSchema.enum.includes(value)) {
            throw new Error(`Property '${propName}' must be one of: ${propSchema.enum.join(', ')}`);
          }
        }
      }
    }
    
    return true;
  }
  
  // Helper to calculate rarity based on properties
  calculateRarity(assetType, properties) {
    const schema = this.schemas.get(assetType);
    if (!schema) {
      throw new Error(`No schema registered for asset type: ${assetType}`);
    }
    
    // Score asset based on property values
    let totalScore = 0;
    let maxScore = 0;
    
    for (const propName in properties) {
      const propSchema = schema.properties[propName];
      const value = properties[propName];
      
      if (propSchema && propSchema.type === 'number') {
        const min = propSchema.min || 0;
        const max = propSchema.max || 100;
        
        if (max > min) {
          const normalized = (value - min) / (max - min);
          totalScore += normalized;
          maxScore += 1;
        }
      }
    }
    
    const rarityScore = maxScore > 0 ? totalScore / maxScore : 0;
    
    // Map score to rarity levels
    for (let i = schema.rarityLevels.length - 1; i >= 0; i--) {
      const rarityLevel = schema.rarityLevels[i];
      const threshold = 1 - rarityLevel.probability;
      
      if (rarityScore >= threshold) {
        return rarityLevel.name;
      }
    }
    
    return schema.rarityLevels[0].name; // Default to common
  }
}
```

## Wallet Integration

### Cross-Platform Wallet Connector

```javascript
// src/sdk/WalletConnector.js
export class WalletConnector {
  constructor(sdk) {
    this.sdk = sdk;
    this.wallet = null;
    this.provider = null;
    this.walletType = null;
  }

  async detectWallets() {
    const availableWallets = [];
    
    // Check for various wallet providers
    if (window.solana) {
      availableWallets.push({
        type: 'phantom',
        name: 'Phantom',
        icon: 'phantom-icon.png'
      });
    }
    
    if (window.solflare) {
      availableWallets.push({
        type: 'solflare',
        name: 'Solflare',
        icon: 'solflare-icon.png'
      });
    }
    
    return availableWallets;
  }

  async connect(walletType) {
    try {
      let provider;
      
      // Handle different wallet types
      switch (walletType) {
        case 'phantom':
          if (!window.solana) {
            throw new Error('Phantom wallet not found');
          }
          provider = window.solana;
          break;
          
        case 'solflare':
          if (!window.solflare) {
            throw new Error('Solflare wallet not found');
          }
          provider = window.solflare;
          break;
          
        default:
          throw new Error(`Unsupported wallet type: ${walletType}`);
      }
      
      // Connect to wallet
      await provider.connect();
      
      // Store connection
      this.wallet = provider;
      this.walletType = walletType;
      this.provider = provider;
      
      // Get wallet address
      const address = provider.publicKey.toString();
      
      // Register wallet with backend
      await this.registerWalletWithBackend(address, walletType);
      
      return {
        success: true,
        address,
        walletType
      };
    } catch (error) {
      console.error('Wallet connection error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async disconnect() {
    if (this.wallet) {
      try {
        await this.wallet.disconnect();
        this.wallet = null;
        this.provider = null;
        this.walletType = null;
        
        return { success: true };
      } catch (error) {
        console.error('Wallet disconnect error:', error);
        return {
          success: false,
          message: error.message
        };
      }
    }
    
    return { success: true };
  }

  async signMessage(message) {
    if (!this.wallet) {
      throw new Error('No wallet connected');
    }
    
    const encodedMessage = new TextEncoder().encode(message);
    const signature = await this.wallet.signMessage(encodedMessage, 'utf8');
    
    return {
      signature: signature.toString('hex'),
      message
    };
  }

  async registerWalletWithBackend(address, walletType) {
    const message = `Connect wallet to Eqic Games: ${this.sdk.gameId}`;
    const signResult = await this.signMessage(message);
    
    await this.sdk.apiRequest('/users/wallet-connect', {
      method: 'POST',
      body: JSON.stringify({
        walletAddress: address,
        walletType,
        signature: signResult.signature,
        message: signResult.message
      })
    });
  }
}
```

## Cross-Game Asset Transfer

The MCP protocol enables asset transfers between different games:

```javascript
// src/sdk/AssetTransfer.js
export class AssetTransferManager {
  constructor(sdk) {
    this.sdk = sdk;
    this.assetMappings = new Map();
  }

  async registerAssetMapping(mapping) {
    const response = await this.sdk.apiRequest('/asset-mappings', {
      method: 'POST',
      body: JSON.stringify(mapping)
    });
    
    this.assetMappings.set(
      `${mapping.sourceGame}:${mapping.sourceAssetType}`,
      mapping
    );
    
    return response;
  }

  async transferAsset(assetId, targetGameId) {
    return await this.sdk.apiRequest(`/assets/${assetId}/transfer`, {
      method: 'POST',
      body: JSON.stringify({ targetGameId })
    });
  }
  
  // Convert an incoming asset from another game to the current game's format
  convertAsset(externalAsset) {
    const mappingKey = `${externalAsset.sourceGame}:${externalAsset.assetType}`;
    const mapping = this.assetMappings.get(mappingKey);
    
    if (!mapping) {
      throw new Error(`No mapping found for asset type ${externalAsset.assetType} from game ${externalAsset.sourceGame}`);
    }
    
    // Create converted asset
    const convertedAsset = {
      id: externalAsset.id,
      name: externalAsset.name,
      assetType: mapping.targetAssetType,
      properties: {},
      rarity: externalAsset.rarity,
      sourceInfo: {
        game: externalAsset.sourceGame,
        assetType: externalAsset.assetType,
        id: externalAsset.id
      }
    };
    
    // Map properties using the mapping rules
    for (const [sourceProp, targetProp] of Object.entries(mapping.propertyMapping)) {
      const sourceValue = externalAsset.properties[sourceProp];
      
      if (typeof targetProp === 'string') {
        // Direct mapping
        convertedAsset.properties[targetProp] = sourceValue;
      } else if (typeof targetProp === 'object' && targetProp.default !== undefined) {
        // Use default if source property doesn't exist
        convertedAsset.properties[sourceProp] = sourceValue !== undefined ? sourceValue : targetProp.default;
      } else if (typeof targetProp === 'function') {
        // Apply transformation function
        convertedAsset.properties[sourceProp] = targetProp(sourceValue);
      }
    }
    
    // Map visual elements
    if (mapping.visualMapping && externalAsset.visual) {
      convertedAsset.visual = {};
      
      if (mapping.visualMapping.models && externalAsset.visual.model) {
        const targetModel = mapping.visualMapping.models[externalAsset.visual.model] || 
                           mapping.visualMapping.models.default;
        
        if (targetModel) {
          convertedAsset.visual.model = targetModel;
        }
      }
      
      // Other visual mappings could be added here (textures, animations, etc.)
    }
    
    return convertedAsset;
  }
}
```

## API Integration

### REST API Client Implementation

```javascript
// src/api/ApiClient.js
export class ApiClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.authToken = null;
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `API request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Request Error (${endpoint}):`, error);
      throw error;
    }
  }

  // User endpoints
  async registerUser(userData) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async loginUser(credentials) {
    const response = await this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  async getUserProfile() {
    return this.request('/users/profile', {
      method: 'GET'
    });
  }

  // Asset endpoints
  async getUserAssets() {
    return this.request('/users/assets', {
      method: 'GET'
    });
  }

  async createAsset(assetData) {
    return this.request('/assets', {
      method: 'POST',
      body: JSON.stringify(assetData)
    });
  }

  async transferAsset(assetId, targetGameId) {
    return this.request(`/assets/${assetId}/transfer`, {
      method: 'POST',
      body: JSON.stringify({ targetGameId })
    });
  }

  // Marketplace endpoints
  async getListings(options = {}) {
    const queryParams = new URLSearchParams();
    
    if (options.page) queryParams.append('page', options.page);
    if (options.limit) queryParams.append('limit', options.limit);
    if (options.filter) queryParams.append('filter', options.filter);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/marketplace/listings?${queryString}` : '/marketplace/listings';
    
    return this.request(endpoint, {
      method: 'GET'
    });
  }

  async createListing(listingData) {
    return this.request('/marketplace/listings', {
      method: 'POST',
      body: JSON.stringify(listingData)
    });
  }

  async purchaseListing(listingId) {
    return this.request(`/marketplace/listings/${listingId}/purchase`, {
      method: 'POST'
    });
  }
}
```

## Game Engine Integration

### Unity SDK Wrapper

```csharp
// Unity C# implementation example
using System;
using System.Threading.Tasks;
using UnityEngine;
using Newtonsoft.Json;

namespace EqicGames.SDK
{
    public class EqicSDK : MonoBehaviour
    {
        private string gameId;
        private string apiKey;
        private string environment;
        private EqicJsInterop jsInterop;
        
        public async Task Initialize(string gameId, string apiKey, string environment = "production")
        {
            this.gameId = gameId;
            this.apiKey = apiKey;
            this.environment = environment;
            
            // Initialize JavaScript interop
            jsInterop = new EqicJsInterop();
            await jsInterop.Initialize(gameId, apiKey, environment);
            
            // Register for asset events
            jsInterop.OnAssetReceived += HandleAssetReceived;
            
            Debug.Log("Eqic SDK initialized successfully");
        }
        
        public async Task<AssetCollection> GetPlayerAssets()
        {
            string result = await jsInterop.CallJsMethod("getPlayerAssets");
            return JsonConvert.DeserializeObject<AssetCollection>(result);
        }
        
        public async Task<TransferResult> TransferAsset(string assetId, string targetGameId)
        {
            string result = await jsInterop.CallJsMethod("transferAsset", assetId, targetGameId);
            return JsonConvert.DeserializeObject<TransferResult>(result);
        }
        
        public async Task<CreateAssetResult> CreateAsset(AssetData assetData)
        {
            string assetJson = JsonConvert.SerializeObject(assetData);
            string result = await jsInterop.CallJsMethod("createAsset", assetJson);
            return JsonConvert.DeserializeObject<CreateAssetResult>(result);
        }
        
        private void HandleAssetReceived(string assetJson)
        {
            try
            {
                Asset asset = JsonConvert.DeserializeObject<Asset>(assetJson);
                OnAssetReceived?.Invoke(asset);
            }
            catch (Exception ex)
            {
                Debug.LogError($"Error processing received asset: {ex.Message}");
            }
        }
        
        // Event for asset reception
        public event Action<Asset> OnAssetReceived;
        
        // Clean up
        private void OnDestroy()
        {
            if (jsInterop != null)
            {
                jsInterop.OnAssetReceived -= HandleAssetReceived;
                jsInterop.Dispose();
            }
        }
        
        // Data classes
        [Serializable]
        public class Asset
        {
            public string id;
            public string name;
            public string assetType;
            public string rarity;
            public Dictionary<string, object> properties;
            public VisualData visual;
        }
        
        [Serializable]
        public class VisualData
        {
            public string model;
            public string texture;
            public float scale;
        }
        
        [Serializable]
        public class AssetCollection
        {
            public bool success;
            public Asset[] assets;
        }
        
        [Serializable]
        public class TransferResult
        {
            public bool success;
            public string message;
        }
        
        [Serializable]
        public class CreateAssetResult
        {
            public bool success;
            public Asset asset;
        }
    }
}
```

## Performance Optimization

### Caching Implementation

```javascript
// src/sdk/CacheManager.js
export class CacheManager {
  constructor(options = {}) {
    this.ttl = options.ttl || 300000; // Default 5 minutes
    this.caches = new Map();
  }

  createCache(name) {
    if (this.caches.has(name)) {
      return this.getCache(name);
    }
    
    const cache = new Map();
    this.caches.set(name, {
      data: cache,
      metadata: new Map()
    });
    
    return cache;
  }

  getCache(name) {
    const cache = this.caches.get(name);
    if (!cache) {
      throw new Error(`Cache '${name}' does not exist`);
    }
    
    return cache.data;
  }

  set(cacheName, key, value) {
    const cache = this.getCache(cacheName);
    const metadata = this.caches.get(cacheName).metadata;
    
    cache.set(key, value);
    metadata.set(key, {
      timestamp: Date.now(),
      expires: Date.now() + this.ttl
    });
    
    return value;
  }

  get(cacheName, key) {
    const cache = this.getCache(cacheName);
    const metadata = this.caches.get(cacheName).metadata;
    
    if (!cache.has(key)) {
      return null;
    }
    
    const entryMetadata = metadata.get(key);
    
    // Check if expired
    if (entryMetadata.expires < Date.now()) {
      this.delete(cacheName, key);
      return null;
    }
    
    return cache.get(key);
  }

  delete(cacheName, key) {
    const cache = this.getCache(cacheName);
    const metadata = this.caches.get(cacheName).metadata;
    
    cache.delete(key);
    metadata.delete(key);
  }

  clear(cacheName) {
    const cache = this.getCache(cacheName);
    const metadata = this.caches.get(cacheName).metadata;
    
    cache.clear();
    metadata.clear();
  }
  
  async getOrFetch(cacheName, key, fetchFunction) {
    let value = this.get(cacheName, key);
    
    if (value === null) {
      value = await fetchFunction();
      this.set(cacheName, key, value);
    }
    
    return value;
  }
}
```

## Developer Resources

- [GitHub Repository](https://github.com/EqicGames/eqic-sdk)
- [SDK Documentation](https://docs.eqicgame.world/sdk)
- [Technical Whitepaper](https://eqicgame.world/whitepaper.pdf)

## System Interactions

The following diagram illustrates the typical interaction flow in the Eqic Games ecosystem:

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │         │             │         │             │
│    User     │         │    Game     │         │ Eqic Server │
│             │         │             │         │             │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │                       │                       │
       ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                       Eqic Games SDK                        │
│                                                             │
├─────────────┬─────────────┬─────────────┬─────────────┬─────┘
│             │             │             │             │
▼             ▼             ▼             ▼             ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│             │  │             │  │             │  │             │
│ API Client  │  │ Asset Mgr   │  │ Marketplace │  │ Wallet Conn │
│             │  │             │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

For more detailed information, please contact our developer support at developers@eqicgame.world. 