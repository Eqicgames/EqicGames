/**
 * Eqic Games - MCP Visual Module
 * Handles game visual generation based on user input
 */

import logicModule from './logic.js';

class VisualModule {
  constructor() {
    this.supportedStyles = ['scifi', 'fantasy', 'cyberpunk', 'modern'];
    this.styleColorSchemes = {
      scifi: {
        primary: '#3498db', // Blue
        secondary: '#2ecc71', // Green
        accent: '#9b59b6', // Purple
        background: '#0a1a2a', // Dark blue
      },
      fantasy: {
        primary: '#8e44ad', // Purple
        secondary: '#27ae60', // Green
        accent: '#f39c12', // Orange
        background: '#2c3e50', // Dark slate
      },
      cyberpunk: {
        primary: '#e74c3c', // Red
        secondary: '#f1c40f', // Yellow
        accent: '#1abc9c', // Turquoise
        background: '#2c3e50', // Dark slate
      },
      modern: {
        primary: '#3498db', // Blue
        secondary: '#e74c3c', // Red
        accent: '#f39c12', // Orange
        background: '#34495e', // Dark blue-gray
      }
    };
  }

  /**
   * Generate game visuals based on user input
   * @param {Object} params - Input parameters
   * @param {string} params.idea - Game idea text
   * @param {string} params.genre - Game genre
   * @param {string} params.style - Visual style
   * @param {string} params.complexity - Game complexity
   * @returns {Object} - Generated game visuals
   */
  async generateVisuals(params) {
    try {
      const { idea, genre, style, complexity } = params;
      
      // Validate inputs
      if (!idea || !genre || !style || !complexity) {
        throw new Error('Missing required parameters for visual generation');
      }
      
      if (!this.supportedStyles.includes(style)) {
        throw new Error(`Unsupported style: ${style}`);
      }
      
      // Process the game idea text
      const keywords = logicModule.extractKeywords(idea);
      
      // Generate visual components based on style and genre
      const colorScheme = this.generateColorScheme(style);
      const uiElements = this.generateUIElements(style, genre, complexity);
      const characters = this.generateCharacters(style, genre, keywords);
      const environments = this.generateEnvironments(style, genre, keywords);
      const animations = this.generateAnimations(style, genre, complexity);
      
      // Generate game icon
      const icon = this.generateGameIcon(style, genre, keywords);
      
      // Simulate AI processing time for visuals
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        colorScheme,
        uiElements,
        characters,
        environments,
        animations,
        icon,
        style
      };
    } catch (error) {
      console.error('Error in VisualModule.generateVisuals:', error);
      throw error;
    }
  }
  
  /**
   * Generate color scheme based on style
   */
  generateColorScheme(style) {
    const baseScheme = this.styleColorSchemes[style] || this.styleColorSchemes.scifi;
    
    // Add some randomness to the colors to make each game unique
    const adjustColor = (color, amount) => {
      const num = parseInt(color.slice(1), 16);
      const r = Math.min(255, Math.max(0, (num >> 16) + amount));
      const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
      const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
      return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    };
    
    // Generate a slightly varied color scheme
    const variation = Math.floor(Math.random() * 20) - 10;
    
    return {
      primary: adjustColor(baseScheme.primary, variation),
      secondary: adjustColor(baseScheme.secondary, variation),
      accent: adjustColor(baseScheme.accent, variation),
      background: adjustColor(baseScheme.background, variation),
      text: '#ffffff',
      textSecondary: '#cccccc'
    };
  }
  
  /**
   * Generate UI elements based on style and genre
   */
  generateUIElements(style, genre, complexity) {
    const elements = {
      mainMenu: {},
      hud: {},
      inventory: {},
      dialogSystem: {}
    };
    
    // Main menu design
    if (style === 'scifi') {
      elements.mainMenu = {
        layout: 'Holographic projection with floating elements',
        animation: 'Elements materialize with digital particles',
        buttonStyle: 'Glowing translucent panels with thin borders'
      };
    } else if (style === 'fantasy') {
      elements.mainMenu = {
        layout: 'Scroll or book-based menu with ornate decorations',
        animation: 'Elements unfurl like magic scrolls',
        buttonStyle: 'Wooden or stone buttons with rune engravings'
      };
    } else if (style === 'cyberpunk') {
      elements.mainMenu = {
        layout: 'Glitched interfaces with neon highlights',
        animation: 'Digital distortion and scan lines',
        buttonStyle: 'Neon-outlined angular buttons with data noise'
      };
    } else if (style === 'modern') {
      elements.mainMenu = {
        layout: 'Clean minimalist design with sharp edges',
        animation: 'Smooth transitions with subtle motion',
        buttonStyle: 'Flat design with subtle shadows and highlights'
      };
    }
    
    // HUD design based on genre
    if (genre === 'rpg') {
      elements.hud = {
        layout: 'Character stats and quest info prominent',
        features: ['Health/mana bars', 'Quest tracker', 'Mini-map', 'Inventory quick access']
      };
    } else if (genre === 'competitive') {
      elements.hud = {
        layout: 'Minimalist design showing only essential information',
        features: ['Score tracker', 'Timer', 'Player ranking', 'Match statistics']
      };
    } else if (genre === 'sandbox') {
      elements.hud = {
        layout: 'Resource-focused design with building tools',
        features: ['Resource counters', 'Building menu', 'Tool selection', 'Environmental info']
      };
    } else if (genre === 'strategy') {
      elements.hud = {
        layout: 'Information-rich displays with unit management',
        features: ['Resource indicators', 'Unit status', 'Mini-map', 'Action buttons']
      };
    }
    
    // Complexity affects UI detail level
    if (complexity === 'simple') {
      elements.complexity = {
        detailLevel: 'Essential elements only, streamlined design',
        animations: 'Simple transitions',
        features: 'Core functionality visible at all times'
      };
    } else if (complexity === 'moderate') {
      elements.complexity = {
        detailLevel: 'Moderate detail with collapsible elements',
        animations: 'Smooth transitions with feedback effects',
        features: 'Tabbed interfaces for additional functions'
      };
    } else if (complexity === 'complex') {
      elements.complexity = {
        detailLevel: 'Highly detailed with customizable layouts',
        animations: 'Advanced particle effects and transitions',
        features: 'Multiple interaction methods and customization options'
      };
    }
    
    return elements;
  }
  
  /**
   * Generate characters based on style and genre
   */
  generateCharacters(style, genre, keywords) {
    const characters = [];
    
    // Generate different character types based on genre
    if (genre === 'rpg') {
      characters.push(
        this.createCharacter('Player character', style, keywords),
        this.createCharacter('NPC ally', style, keywords),
        this.createCharacter('Enemy', style, keywords),
        this.createCharacter('Merchant', style, keywords)
      );
    } else if (genre === 'competitive') {
      characters.push(
        this.createCharacter('Player avatar', style, keywords),
        this.createCharacter('Opponent', style, keywords)
      );
      
      if (keywords.includes('racing')) {
        characters.push(this.createCharacter('Race official', style, keywords));
      }
    } else if (genre === 'sandbox') {
      characters.push(
        this.createCharacter('Player avatar', style, keywords),
        this.createCharacter('Wildlife', style, keywords)
      );
      
      if (!keywords.includes('space')) {
        characters.push(this.createCharacter('Villager', style, keywords));
      }
    } else if (genre === 'strategy') {
      characters.push(
        this.createCharacter('Commander', style, keywords),
        this.createCharacter('Basic unit', style, keywords),
        this.createCharacter('Advanced unit', style, keywords),
        this.createCharacter('Enemy leader', style, keywords)
      );
    }
    
    return characters;
  }
  
  /**
   * Helper to create character description
   */
  createCharacter(type, style, keywords) {
    let appearance = '';
    let animations = [];
    
    // Style-based appearance
    if (style === 'scifi') {
      appearance = 'High-tech armor with glowing elements';
      animations = ['Smooth technological movements', 'Holographic highlights'];
      
      if (keywords.includes('space')) {
        appearance += ' and space-ready equipment';
      }
    } else if (style === 'fantasy') {
      appearance = 'Medieval-inspired clothing with magical elements';
      animations = ['Flowing cloth physics', 'Magical particle effects'];
      
      if (keywords.includes('battle')) {
        appearance += ' and ornate weapons';
      }
    } else if (style === 'cyberpunk') {
      appearance = 'Urban street wear with technological augments';
      animations = ['Mechanical joint movements', 'Neon highlight effects'];
      
      if (keywords.includes('hack')) {
        appearance += ' and neural interface technology';
      }
    } else if (style === 'modern') {
      appearance = 'Contemporary clothing with realistic details';
      animations = ['Natural movement cycles', 'Realistic facial expressions'];
    }
    
    // Keyword-based modifications
    if (keywords.includes('robot') || keywords.includes('mech')) {
      appearance = 'Mechanical body with articulated joints and technological details';
      animations = ['Servo-driven movements', 'Mechanical transformation sequences'];
    }
    
    return {
      type,
      appearance,
      animations
    };
  }
  
  /**
   * Generate environments based on style and genre
   */
  generateEnvironments(style, genre, keywords) {
    const environments = [];
    
    // Generate different environment types based on style and keywords
    if (style === 'scifi') {
      environments.push({
        type: 'Futuristic city',
        features: ['Towering skyscrapers', 'Flying vehicles', 'Holographic billboards', 'Advanced infrastructure'],
        lighting: 'Blue-tinted technological lighting with bloom effects'
      });
      
      if (keywords.includes('space')) {
        environments.push({
          type: 'Space station',
          features: ['Modular construction', 'Observation windows', 'Artificial gravity zones', 'Docking bays'],
          lighting: 'Stark contrast between dark space and interior lighting'
        });
        
        environments.push({
          type: 'Alien planet',
          features: ['Exotic flora', 'Strange geological formations', 'Alien architecture', 'Unusual atmospheric effects'],
          lighting: 'Alien sun with unique color cast and atmospheric scattering'
        });
      }
    } else if (style === 'fantasy') {
      environments.push({
        type: 'Medieval village',
        features: ['Thatched cottages', 'Town square', 'Marketplace', 'Surrounding farmland'],
        lighting: 'Warm golden sunlight with soft shadows'
      });
      
      environments.push({
        type: 'Ancient ruins',
        features: ['Crumbling stone architecture', 'Overgrown vegetation', 'Hidden chambers', 'Magical artifacts'],
        lighting: 'Dappled light through broken ceilings with god rays'
      });
      
      if (keywords.includes('forest') || keywords.includes('nature')) {
        environments.push({
          type: 'Enchanted forest',
          features: ['Giant ancient trees', 'Mystical flora', 'Flowing streams', 'Hidden clearings'],
          lighting: 'Magical particles in air with refracted light through leaves'
        });
      }
    } else if (style === 'cyberpunk') {
      environments.push({
        type: 'Neon-lit metropolis',
        features: ['Crowded streets', 'Towering corporate buildings', 'Digital billboards', 'Street markets'],
        lighting: 'Neon signs casting colorful glow through rain and fog'
      });
      
      environments.push({
        type: 'Underground facility',
        features: ['Industrial machinery', 'Server farms', 'Security systems', 'Maintenance tunnels'],
        lighting: 'Harsh artificial lighting with strong shadows'
      });
      
      if (keywords.includes('race') || keywords.includes('racing')) {
        environments.push({
          type: 'Urban racing circuit',
          features: ['High-speed highways', 'Dangerous shortcuts', 'Spectator zones', 'Digital track markers'],
          lighting: 'Street lights and vehicle headlights cutting through night'
        });
      }
    } else if (style === 'modern') {
      environments.push({
        type: 'Contemporary city',
        features: ['Realistic architecture', 'Traffic systems', 'Parks', 'Commercial districts'],
        lighting: 'Physically accurate lighting with time of day cycle'
      });
      
      if (keywords.includes('nature') || keywords.includes('outdoor')) {
        environments.push({
          type: 'Natural landscape',
          features: ['Realistic terrain', 'Diverse flora', 'Weather systems', 'Wildlife'],
          lighting: 'Dynamic weather affecting lighting conditions'
        });
      }
    }
    
    // Add genre-specific environments
    if (genre === 'rpg' && !environments.some(e => e.type.includes('town'))) {
      environments.push({
        type: 'Main town hub',
        features: ['Quest givers', 'Shops', 'Player housing', 'Social areas'],
        lighting: 'Warm inviting lighting for social spaces'
      });
    } else if (genre === 'competitive' && !environments.some(e => e.type.includes('arena'))) {
      environments.push({
        type: 'Competition arena',
        features: ['Spectator seating', 'Competition areas', 'Scoreboard displays', 'Training facilities'],
        lighting: 'Dramatic spotlights highlighting competition areas'
      });
    } else if (genre === 'sandbox' && !environments.some(e => e.type.includes('build'))) {
      environments.push({
        type: 'Building canvas',
        features: ['Flat areas for construction', 'Resource deposits', 'Construction guides', 'Example structures'],
        lighting: 'Clear visibility lighting to assist building'
      });
    } else if (genre === 'strategy' && !environments.some(e => e.type.includes('map'))) {
      environments.push({
        type: 'Strategic map',
        features: ['Territory borders', 'Resource nodes', 'Tactical terrain', 'Base locations'],
        lighting: 'Clear overhead lighting for strategic visibility'
      });
    }
    
    return environments;
  }
  
  /**
   * Generate animations based on style and genre
   */
  generateAnimations(style, genre, complexity) {
    const animations = {
      ui: [],
      character: [],
      environment: [],
      effects: []
    };
    
    // UI animations
    if (style === 'scifi') {
      animations.ui.push('Holographic interfaces materializing', 'Digital scanning effects', 'Data stream visualizations');
    } else if (style === 'fantasy') {
      animations.ui.push('Magical scroll unfurling', 'Rune activation sequences', 'Elemental transitions');
    } else if (style === 'cyberpunk') {
      animations.ui.push('Glitch effects', 'Digital distortion', 'Scan line interruptions');
    } else if (style === 'modern') {
      animations.ui.push('Clean slide transitions', 'Subtle fade effects', 'Minimalist motion design');
    }
    
    // Character animations based on genre
    if (genre === 'rpg') {
      animations.character.push('Combat sequences', 'Spell casting', 'Interactive dialogue', 'Item usage');
    } else if (genre === 'competitive') {
      animations.character.push('Athletic movements', 'Victory celebrations', 'Defeat reactions', 'Specialized skills');
    } else if (genre === 'sandbox') {
      animations.character.push('Building actions', 'Resource gathering', 'Tool usage', 'Environmental interaction');
    } else if (genre === 'strategy') {
      animations.character.push('Command gestures', 'Unit formations', 'Construction sequences', 'Battle animations');
    }
    
    // Environment animations
    animations.environment.push('Weather systems', 'Day-night cycles', 'Ambient wildlife', 'Dynamic elements');
    
    if (style === 'scifi') {
      animations.environment.push('Holographic displays', 'Automated systems', 'Energy field fluctuations');
    } else if (style === 'fantasy') {
      animations.environment.push('Magical phenomena', 'Mystical creatures', 'Enchanted objects');
    } else if (style === 'cyberpunk') {
      animations.environment.push('Digital advertisements', 'Urban crowd movement', 'Technological malfunctions');
    } else if (style === 'modern') {
      animations.environment.push('Realistic crowd behavior', 'Traffic systems', 'Natural phenomena');
    }
    
    // Effect animations
    animations.effects.push('Particle systems', 'Lighting effects', 'Impact visualizations');
    
    if (style === 'scifi') {
      animations.effects.push('Energy beams', 'Shield impacts', 'Teleportation effects');
    } else if (style === 'fantasy') {
      animations.effects.push('Spell effects', 'Magical transformations', 'Elemental manifestations');
    } else if (style === 'cyberpunk') {
      animations.effects.push('Neon trails', 'Digital disruptions', 'Holographic glitches');
    } else if (style === 'modern') {
      animations.effects.push('Realistic physics', 'Environmental reactions', 'Natural forces');
    }
    
    // Complexity affects animation detail
    if (complexity === 'complex') {
      animations.complexity = 'High detail with procedural elements and physics interaction';
    } else if (complexity === 'moderate') {
      animations.complexity = 'Medium detail with key frame animation and some physics';
    } else {
      animations.complexity = 'Simplified animations focusing on core gameplay elements';
    }
    
    return animations;
  }
  
  /**
   * Generate game icon based on style, genre and keywords
   */
  generateGameIcon(style, genre, keywords) {
    // In a real implementation, this would generate an actual icon
    // For this prototype, we'll return a description of what the icon would look like
    
    let iconBase = '';
    let iconElements = [];
    let colorScheme = this.styleColorSchemes[style];
    
    // Base icon style
    if (style === 'scifi') {
      iconBase = 'Futuristic emblem with technological elements';
      iconElements.push('Digital circuit patterns', 'Holographic overlay');
    } else if (style === 'fantasy') {
      iconBase = 'Ornate magical crest';
      iconElements.push('Ancient runes', 'Mystical symbols');
    } else if (style === 'cyberpunk') {
      iconBase = 'Glitched neon symbol';
      iconElements.push('Digital distortion', 'Bright neon accents');
    } else if (style === 'modern') {
      iconBase = 'Clean minimalist logo';
      iconElements.push('Simple geometric shapes', 'Gradient background');
    }
    
    // Genre modifications
    if (genre === 'rpg') {
      iconElements.push('Character silhouette', 'Adventure elements');
    } else if (genre === 'competitive') {
      iconElements.push('Dynamic action pose', 'Competition symbols');
    } else if (genre === 'sandbox') {
      iconElements.push('Building blocks', 'Creative tools');
    } else if (genre === 'strategy') {
      iconElements.push('Strategic map elements', 'Command symbols');
    }
    
    // Keyword-based elements
    if (keywords.includes('space') || keywords.includes('star')) {
      iconElements.push('Cosmic background', 'Planetary elements');
    }
    
    if (keywords.includes('battle') || keywords.includes('fight')) {
      iconElements.push('Crossed weapons', 'Battle insignia');
    }
    
    if (keywords.includes('racing') || keywords.includes('race')) {
      iconElements.push('Speed lines', 'Vehicle silhouette');
    }
    
    return {
      description: `${iconBase} featuring ${iconElements.join(', ')}`,
      primaryColor: colorScheme.primary,
      secondaryColor: colorScheme.secondary,
      accentColor: colorScheme.accent
    };
  }
}

// Create singleton instance
const visualModuleInstance = new VisualModule();

export default visualModuleInstance; 