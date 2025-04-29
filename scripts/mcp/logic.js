/**
 * Eqic Games - MCP Logic Module
 * Handles game logic generation based on user input
 */

class LogicModule {
  constructor() {
    this.supportedGenres = ['rpg', 'competitive', 'sandbox', 'strategy'];
    this.complexityLevels = ['simple', 'moderate', 'complex'];
  }

  /**
   * Generate game logic based on user input
   * @param {Object} params - Input parameters
   * @param {string} params.idea - Game idea text
   * @param {string} params.genre - Game genre
   * @param {string} params.complexity - Game complexity
   * @returns {Object} - Generated game logic
   */
  async generateLogic(params) {
    try {
      const { idea, genre, complexity } = params;
      
      // Validate inputs
      if (!idea || !genre || !complexity) {
        throw new Error('Missing required parameters');
      }
      
      if (!this.supportedGenres.includes(genre)) {
        throw new Error(`Unsupported genre: ${genre}`);
      }
      
      if (!this.complexityLevels.includes(complexity)) {
        throw new Error(`Unsupported complexity: ${complexity}`);
      }
      
      // Process the game idea text
      const keywords = this.extractKeywords(idea);
      
      // Generate logic components based on genre and complexity
      const gameplayMechanics = this.generateGameplayMechanics(genre, complexity, keywords);
      const gameRules = this.generateGameRules(genre, complexity, keywords);
      const progressionSystem = this.generateProgressionSystem(genre, complexity);
      const aiSystem = this.generateAISystem(genre, complexity);
      const interactionSystem = this.generateInteractionSystem(genre, complexity);
      
      // Generate game title
      const gameTitle = this.generateGameTitle(genre, keywords);
      
      // Generate game description
      const gameDescription = this.generateGameDescription(idea, genre, complexity, keywords);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        title: gameTitle,
        description: gameDescription,
        mechanics: gameplayMechanics,
        rules: gameRules,
        progression: progressionSystem,
        ai: aiSystem,
        interaction: interactionSystem,
        genre,
        complexity
      };
    } catch (error) {
      console.error('Error in LogicModule.generateLogic:', error);
      throw error;
    }
  }
  
  /**
   * Extract relevant keywords from the game idea
   */
  extractKeywords(idea) {
    // Convert to lowercase and remove common words
    const words = idea.toLowerCase()
      .replace(/develop|create|make|a|an|the|game|about|with|for|and|or|in|of|to|that|is|are|by/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    // Remove duplicates
    const uniqueWords = [...new Set(words)];
    
    // Sort by length (longer words are potentially more meaningful)
    return uniqueWords.sort((a, b) => b.length - a.length).slice(0, 5);
  }
  
  /**
   * Generate gameplay mechanics based on genre and complexity
   */
  generateGameplayMechanics(genre, complexity, keywords) {
    const mechanics = [];
    
    if (genre === 'rpg') {
      mechanics.push('Character advancement system');
      mechanics.push('Quest-based narrative structure');
      
      if (complexity !== 'simple') {
        mechanics.push('Skill tree with specialization paths');
        mechanics.push('Dynamic dialogue system');
      }
      
      if (complexity === 'complex') {
        mechanics.push('Faction reputation system');
        mechanics.push('Moral choice system affecting gameplay');
        mechanics.push('Dynamic weather and time system');
      }
    } 
    else if (genre === 'competitive') {
      mechanics.push('PvP matchmaking system');
      mechanics.push('Score and ranking system');
      
      if (complexity !== 'simple') {
        mechanics.push('Tournament bracket generation');
        mechanics.push('Team formation mechanics');
      }
      
      if (complexity === 'complex') {
        mechanics.push('Spectator mode with replay features');
        mechanics.push('Season-based leaderboards');
        mechanics.push('Meta progression between matches');
      }
    }
    else if (genre === 'sandbox') {
      mechanics.push('Free-form building and destruction');
      mechanics.push('Resource gathering and crafting');
      
      if (complexity !== 'simple') {
        mechanics.push('Physics-based interaction system');
        mechanics.push('Environmental manipulation');
      }
      
      if (complexity === 'complex') {
        mechanics.push('Ecosystem simulation');
        mechanics.push('Weather and natural disaster system');
        mechanics.push('NPC settlement generation');
      }
    }
    else if (genre === 'strategy') {
      mechanics.push('Resource management');
      mechanics.push('Unit control and formations');
      
      if (complexity !== 'simple') {
        mechanics.push('Tech tree advancement system');
        mechanics.push('Fog-of-war and scouting mechanics');
      }
      
      if (complexity === 'complex') {
        mechanics.push('Diplomatic relations system');
        mechanics.push('Dynamic faction emergence');
        mechanics.push('Economic simulation with supply and demand');
      }
    }
    
    // Add mechanics related to keywords
    if (keywords.includes('racing') || keywords.includes('race')) {
      mechanics.push('Speed-based competition system');
      mechanics.push('Track variety and hazards');
      if (complexity !== 'simple') {
        mechanics.push('Vehicle customization and upgrades');
      }
    }
    
    if (keywords.includes('space') || keywords.includes('galaxy') || keywords.includes('star')) {
      mechanics.push('Zero-gravity movement system');
      mechanics.push('Planetary exploration mechanics');
      if (complexity !== 'simple') {
        mechanics.push('Spacecraft customization and management');
      }
    }
    
    if (keywords.includes('battle') || keywords.includes('fight') || keywords.includes('combat')) {
      mechanics.push('Combat system with attack varieties');
      mechanics.push('Damage type and resistance mechanics');
      if (complexity !== 'simple') {
        mechanics.push('Combo-based attack sequences');
      }
    }
    
    return mechanics;
  }
  
  /**
   * Generate game rules based on genre and complexity
   */
  generateGameRules(genre, complexity, keywords) {
    const rules = [];
    
    // Basic rules based on genre
    if (genre === 'rpg') {
      rules.push('Character abilities determined by stats and equipment');
      rules.push('Quest completion rewards experience and items');
    } 
    else if (genre === 'competitive') {
      rules.push('Matches have time limits and victory conditions');
      rules.push('Players ranked by performance metrics');
    }
    else if (genre === 'sandbox') {
      rules.push('Building requires appropriate resources');
      rules.push('Day/night cycle affects gameplay elements');
    }
    else if (genre === 'strategy') {
      rules.push('Resources are used to build units and structures');
      rules.push('Vision range determines information availability');
    }
    
    // Additional rules based on complexity
    if (complexity === 'moderate') {
      rules.push('Secondary objectives provide bonus rewards');
      rules.push('Special events occur at timed intervals');
    }
    else if (complexity === 'complex') {
      rules.push('Environmental factors affect gameplay mechanics');
      rules.push('Hidden mechanics revealed through gameplay exploration');
      rules.push('Emergent systems create unpredictable scenarios');
    }
    
    // Additional rules based on keywords
    if (keywords.includes('racing') || keywords.includes('race')) {
      rules.push('First to cross finish line wins the race');
      if (complexity !== 'simple') {
        rules.push('Shortcuts provide high-risk, high-reward options');
      }
    }
    
    if (keywords.includes('space') || keywords.includes('galaxy')) {
      rules.push('Resource management includes oxygen/fuel considerations');
      if (complexity !== 'simple') {
        rules.push('Gravity affects movement and gameplay mechanics');
      }
    }
    
    if (keywords.includes('battle') || keywords.includes('fight')) {
      rules.push('Combat follows initiative-based turn order');
      if (complexity !== 'simple') {
        rules.push('Critical hits provide bonus damage or effects');
      }
    }
    
    return rules;
  }
  
  /**
   * Generate progression system based on genre and complexity
   */
  generateProgressionSystem(genre, complexity) {
    const progression = {
      type: '',
      features: []
    };
    
    if (genre === 'rpg') {
      progression.type = 'Experience-based level progression';
      progression.features.push('Character levels increase stats');
      
      if (complexity !== 'simple') {
        progression.features.push('Skill points allocated at level up');
        progression.features.push('Equipment tiers gated by level');
      }
      
      if (complexity === 'complex') {
        progression.features.push('Specialization paths with unique abilities');
        progression.features.push('Crafting recipes unlocked by progression');
      }
    }
    else if (genre === 'competitive') {
      progression.type = 'Rank-based progression';
      progression.features.push('Win/loss record determines rank');
      
      if (complexity !== 'simple') {
        progression.features.push('Seasonal rewards based on final rank');
        progression.features.push('Cosmetic unlocks for achievements');
      }
      
      if (complexity === 'complex') {
        progression.features.push('Meta-progression between seasons');
        progression.features.push('Tournament qualification based on rank');
      }
    }
    else if (genre === 'sandbox') {
      progression.type = 'Discovery-based progression';
      progression.features.push('New recipes/blueprints discovered through play');
      
      if (complexity !== 'simple') {
        progression.features.push('Tool upgrades increase building capability');
        progression.features.push('New areas unlocked through progression');
      }
      
      if (complexity === 'complex') {
        progression.features.push('Technology tree unlocks advanced building options');
        progression.features.push('Ecosystem evolution responds to player actions');
      }
    }
    else if (genre === 'strategy') {
      progression.type = 'Technology-based progression';
      progression.features.push('Research unlocks new units and buildings');
      
      if (complexity !== 'simple') {
        progression.features.push('Era advancement changes available technologies');
        progression.features.push('Resource-based tech tree decisions');
      }
      
      if (complexity === 'complex') {
        progression.features.push('Multiple advancement paths with tradeoffs');
        progression.features.push('Civilization traits evolve based on choices');
      }
    }
    
    return progression;
  }
  
  /**
   * Generate AI system based on genre and complexity
   */
  generateAISystem(genre, complexity) {
    const ai = {
      type: '',
      behaviors: []
    };
    
    if (genre === 'rpg') {
      ai.type = 'NPC behavior system';
      ai.behaviors.push('NPCs follow daily schedules');
      
      if (complexity !== 'simple') {
        ai.behaviors.push('NPCs respond to player reputation');
        ai.behaviors.push('Enemies use tactical combat behaviors');
      }
      
      if (complexity === 'complex') {
        ai.behaviors.push('Dynamic NPC relationships form based on events');
        ai.behaviors.push('Adaptive difficulty scaling based on player skill');
      }
    }
    else if (genre === 'competitive') {
      ai.type = 'Opponent AI system';
      ai.behaviors.push('AI opponents with difficulty tiers');
      
      if (complexity !== 'simple') {
        ai.behaviors.push('AI learns from player tactics');
        ai.behaviors.push('Different AI personalities with playstyles');
      }
      
      if (complexity === 'complex') {
        ai.behaviors.push('Neural network-based opponent learning');
        ai.behaviors.push('AI adapts to meta strategies');
      }
    }
    else if (genre === 'sandbox') {
      ai.type = 'Ecosystem simulation';
      ai.behaviors.push('NPCs perform roles in the environment');
      
      if (complexity !== 'simple') {
        ai.behaviors.push('Animal AI with predator/prey relationships');
        ai.behaviors.push('NPC settlements grow and develop');
      }
      
      if (complexity === 'complex') {
        ai.behaviors.push('Full ecosystem simulation with interdependencies');
        ai.behaviors.push('Environmental adaption to player changes');
      }
    }
    else if (genre === 'strategy') {
      ai.type = 'Strategic opponent AI';
      ai.behaviors.push('AI evaluates resource control and objectives');
      
      if (complexity !== 'simple') {
        ai.behaviors.push('AI forms alliances and rivalries');
        ai.behaviors.push('Multiple AI personalities with strategies');
      }
      
      if (complexity === 'complex') {
        ai.behaviors.push('AI analyzes and counters player strategies');
        ai.behaviors.push('Emergent AI behavior based on game state');
      }
    }
    
    return ai;
  }
  
  /**
   * Generate interaction system based on genre and complexity
   */
  generateInteractionSystem(genre, complexity) {
    const interaction = {
      type: '',
      features: []
    };
    
    if (genre === 'rpg') {
      interaction.type = 'Dialogue and quest interaction';
      interaction.features.push('Multi-choice dialogue system');
      
      if (complexity !== 'simple') {
        interaction.features.push('Dialogue options based on character stats');
        interaction.features.push('Quest paths branch based on choices');
      }
      
      if (complexity === 'complex') {
        interaction.features.push('NPC relationships track past interactions');
        interaction.features.push('Moral choice system affects world state');
      }
    }
    else if (genre === 'competitive') {
      interaction.type = 'Player vs player interaction';
      interaction.features.push('In-game emotes and communication');
      
      if (complexity !== 'simple') {
        interaction.features.push('Team formation and management');
        interaction.features.push('Post-match statistics and replays');
      }
      
      if (complexity === 'complex') {
        interaction.features.push('Tournament organization tools');
        interaction.features.push('Spectator and commentary features');
      }
    }
    else if (genre === 'sandbox') {
      interaction.type = 'Environment manipulation';
      interaction.features.push('Building and crafting interface');
      
      if (complexity !== 'simple') {
        interaction.features.push('Complex object interaction system');
        interaction.features.push('Blueprint sharing between players');
      }
      
      if (complexity === 'complex') {
        interaction.features.push('Automation and programming tools');
        interaction.features.push('Community challenge and showcase system');
      }
    }
    else if (genre === 'strategy') {
      interaction.type = 'Command and control interface';
      interaction.features.push('Unit selection and command issuing');
      
      if (complexity !== 'simple') {
        interaction.features.push('Diplomatic communication with AI factions');
        interaction.features.push('Alliance and trade agreement interface');
      }
      
      if (complexity === 'complex') {
        interaction.features.push('Advanced automation and unit behaviors');
        interaction.features.push('Political and espionage mechanics');
      }
    }
    
    return interaction;
  }
  
  /**
   * Generate game title based on genre and keywords
   */
  generateGameTitle(genre, keywords) {
    const prefixes = {
      rpg: ['Chronicles of', 'Legend of', 'Tales of', 'Quest for', 'Realms of'],
      competitive: ['Ultimate', 'Champion', 'Arena of', 'Masters of', 'Clash of'],
      sandbox: ['Infinite', 'Boundless', 'Creator\'s', 'World of', 'Craft & Create:'],
      strategy: ['Empire of', 'Dominion:', 'Command & Conquer:', 'Age of', 'Throne of']
    };
    
    const suffixes = {
      rpg: ['Destiny', 'Legends', 'Heroes', 'Adventure', 'Saga'],
      competitive: ['Tournament', 'Championship', 'Showdown', 'Arena', 'Legends'],
      sandbox: ['Universe', 'Worlds', 'Creation', 'Frontier', 'Genesis'],
      strategy: ['Empires', 'Kingdoms', 'Conquest', 'Dominion', 'Reign']
    };
    
    // Get relevant prefix and suffix arrays
    const genrePrefixes = prefixes[genre] || prefixes.rpg;
    const genreSuffixes = suffixes[genre] || suffixes.rpg;
    
    // Select random prefix and suffix
    const prefix = genrePrefixes[Math.floor(Math.random() * genrePrefixes.length)];
    const suffix = genreSuffixes[Math.floor(Math.random() * genreSuffixes.length)];
    
    // Get most important keyword (first one)
    let mainKeyword = '';
    if (keywords.length > 0) {
      mainKeyword = keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1);
    }
    
    // Combine elements to form title
    if (Math.random() > 0.5 && mainKeyword) {
      return `${prefix} ${mainKeyword}`;
    } else if (mainKeyword) {
      return `${mainKeyword} ${suffix}`;
    } else {
      return `${prefix} ${suffix}`;
    }
  }
  
  /**
   * Generate game description based on idea, genre, complexity and keywords
   */
  generateGameDescription(idea, genre, complexity, keywords) {
    let description = '';
    
    // Start with based on the genre
    if (genre === 'rpg') {
      description = 'An immersive role-playing experience where players ';
    } else if (genre === 'competitive') {
      description = 'A fast-paced competitive game where players ';
    } else if (genre === 'sandbox') {
      description = 'A limitless sandbox experience where players ';
    } else if (genre === 'strategy') {
      description = 'A deep strategic challenge where players ';
    }
    
    // Process the original idea into the description
    const processedIdea = idea
      .toLowerCase()
      .replace(/develop|create|make|a\s|an\s|the\s|game about|game/g, '');
      
    description += processedIdea.trim() + '.';
    
    // Add complexity-based details
    if (complexity === 'moderate') {
      description += ' The game features multiple mechanics including ' +
        this.getRandomFeaturesByGenre(genre) + '.';
    } else if (complexity === 'complex') {
      description += ' This advanced game includes ' +
        this.getRandomFeaturesByGenre(genre) + ' with ' +
        this.getRandomComplexFeaturesByGenre(genre) + '.';
    }
    
    return description;
  }
  
  /**
   * Get random features by genre for description generation
   */
  getRandomFeaturesByGenre(genre) {
    const features = {
      rpg: ['character progression', 'questing', 'NPC interaction', 'world exploration'],
      competitive: ['matchmaking', 'leaderboards', 'skillful mechanics', 'tournament support'],
      sandbox: ['building', 'crafting', 'resource gathering', 'terrain manipulation'],
      strategy: ['resource management', 'unit control', 'base building', 'technology advancement']
    };
    
    const genreFeatures = features[genre] || features.rpg;
    const selected = [];
    
    // Pick 2 random features
    while (selected.length < 2 && genreFeatures.length > 0) {
      const index = Math.floor(Math.random() * genreFeatures.length);
      selected.push(genreFeatures[index]);
      genreFeatures.splice(index, 1);
    }
    
    return selected.join(' and ');
  }
  
  /**
   * Get random complex features by genre for description generation
   */
  getRandomComplexFeaturesByGenre(genre) {
    const features = {
      rpg: ['branching storylines', 'moral choice systems', 'dynamic world events', 'deep character customization'],
      competitive: ['advanced matchmaking algorithms', 'replay systems', 'spectator mode', 'meta progression'],
      sandbox: ['procedural generation', 'automated systems', 'ecosystem simulation', 'player-driven economy'],
      strategy: ['diplomatic relationships', 'complex AI behavior', 'emergent gameplay', 'dynamic world generation']
    };
    
    const genreFeatures = features[genre] || features.rpg;
    
    // Pick 1 random complex feature
    const index = Math.floor(Math.random() * genreFeatures.length);
    return genreFeatures[index];
  }
}

// Create singleton instance
const logicModuleInstance = new LogicModule();

export default logicModuleInstance; 