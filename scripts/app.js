/**
 * Eqic Game Platform - Main Application
 * Initializes and configures all platform modules
 */

// Import modules
const { A2ATransfer, A2APlatforms } = require('./a2a');
const { AssetGenerator } = require('./asset');
const visualModule = require('./mcp/visual');
const logicModule = require('./mcp/logic');
const wallet = require('./utils/wallet');

/**
 * Main application class
 */
class EqicGameApp {
  constructor() {
    this.modules = {
      a2a: null,
      asset: null,
      wallet: wallet
    };
    
    this.config = {
      environment: process.env.NODE_ENV || 'development',
      apiBaseUrl: process.env.API_BASE_URL || 'https://api.eqicgame.com',
      featureFlags: {
        enableA2A: true,
        enableAssetGeneration: true,
        enableMCP: true
      }
    };
    
    console.log(`Eqic Game initializing in ${this.config.environment} mode`);
  }
  
  /**
   * Initialize all modules
   */
  async init() {
    try {
      // Initialize wallet system
      await wallet.init();
      
      // Initialize A2A system if enabled
      if (this.config.featureFlags.enableA2A) {
        const a2aTransfer = new A2ATransfer();
        await a2aTransfer.init({
          feePercentage: 1.2,
          supportedPlatforms: A2APlatforms.getAllPlatforms(true).map(p => p.id)
        });
        this.modules.a2a = a2aTransfer;
      }
      
      // Initialize asset generator if enabled
      if (this.config.featureFlags.enableAssetGeneration) {
        this.modules.asset = new AssetGenerator();
      }
      
      console.log('Eqic Game platform initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Eqic Game platform:', error);
      return false;
    }
  }
  
  /**
   * Generate a complete game based on user input
   */
  async generateGame(gameParams) {
    try {
      const { idea, genre, style, complexity } = gameParams;
      
      // Generate game logic
      const gameLogic = await logicModule.generateLogic({
        idea,
        genre,
        complexity
      });
      
      // Generate game visuals
      const gameVisuals = await visualModule.generateVisuals({
        idea,
        genre,
        style,
        complexity
      });
      
      // Generate starter assets if asset generation is enabled
      let gameAssets = [];
      if (this.config.featureFlags.enableAssetGeneration && this.modules.asset) {
        // Generate a few starter assets
        gameAssets = await this.modules.asset.generateBatch({
          count: 5,
          assetType: genre === 'rpg' ? 'character' : 'item'
        });
      }
      
      return {
        id: `game-${Date.now()}`,
        logic: gameLogic,
        visuals: gameVisuals,
        assets: gameAssets,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Game generation failed:', error);
      throw error;
    }
  }
  
  /**
   * Get available game templates
   */
  getGameTemplates() {
    return [
      {
        id: 'rpg-fantasy',
        name: 'Fantasy RPG',
        description: 'Classic role-playing game with fantasy elements',
        genre: 'rpg',
        style: 'fantasy',
        complexity: 'moderate'
      },
      {
        id: 'competitive-cyberpunk',
        name: 'Cyberpunk Arena',
        description: 'Fast-paced competitive gameplay in a dystopian future',
        genre: 'competitive',
        style: 'cyberpunk',
        complexity: 'moderate'
      },
      {
        id: 'sandbox-scifi',
        name: 'Space Explorer',
        description: 'Open-world space exploration and building game',
        genre: 'sandbox',
        style: 'scifi',
        complexity: 'complex'
      },
      {
        id: 'strategy-modern',
        name: 'Modern Conquest',
        description: 'Strategic warfare simulation in a contemporary setting',
        genre: 'strategy',
        style: 'modern',
        complexity: 'complex'
      }
    ];
  }
}

// Create singleton instance
const app = new EqicGameApp();

module.exports = app; 