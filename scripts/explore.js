/**
 * Eqic Games - Explore Page
 * Handles game exploration, filtering, and wallet connection
 */

import wallet from './utils/wallet.js';

// Mock data for games - in a real app, this would come from an API
const MOCK_GAMES = [
    {
        id: 'game1',
        title: 'Stellar Odyssey',
        creator: 'CryptoCreator.eth',
        description: 'An immersive space exploration RPG with complex ship customization and planetary landing mechanics.',
        genre: 'rpg',
        complexity: 'complex',
        rating: 4.2,
        players: 2500,
        assets: 320,
        volume: 15200,
        platforms: ['web3', 'pc'],
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        createdAt: new Date('2025-03-15')
    },
    {
        id: 'game2',
        title: 'Cyber Racer',
        creator: 'RacingDev',
        description: 'A fast-paced racing game set in a cyberpunk city with high-stakes tournaments and vehicle customization.',
        genre: 'competitive',
        complexity: 'moderate',
        rating: 4.8,
        players: 5700,
        assets: 250,
        volume: 28600,
        platforms: ['web3', 'pc', 'mobile'],
        image: 'https://images.unsplash.com/photo-1556035511-3168381ea4d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        createdAt: new Date('2025-04-02')
    },
    {
        id: 'game3',
        title: 'Boundless Realm',
        creator: 'WorldBuilder',
        description: 'A limitless sandbox experience where players can build, craft, and explore procedurally generated worlds.',
        genre: 'sandbox',
        complexity: 'complex',
        rating: 4.3,
        players: 3200,
        assets: 1200,
        volume: 19500,
        platforms: ['web3', 'pc', 'console'],
        image: 'https://images.unsplash.com/photo-1541928706-2801505cbe72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        createdAt: new Date('2025-03-28')
    },
    {
        id: 'game4',
        title: 'Throne of Empires',
        creator: 'StrategyMaster',
        description: 'A deep strategic challenge where players build empires, form alliances, and conquer territories.',
        genre: 'strategy',
        complexity: 'complex',
        rating: 4.1,
        players: 1800,
        assets: 420,
        volume: 12300,
        platforms: ['web3', 'pc'],
        image: 'https://images.unsplash.com/photo-1559638753-d8ffa15efd43?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        createdAt: new Date('2025-03-10')
    },
    {
        id: 'game5',
        title: 'Pixel Legends',
        creator: 'RetroGamer',
        description: 'A retro-style RPG with modern blockchain mechanics and collectible pixel characters.',
        genre: 'rpg',
        complexity: 'simple',
        rating: 4.5,
        players: 8200,
        assets: 520,
        volume: 32100,
        platforms: ['web3', 'mobile'],
        image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        createdAt: new Date('2025-04-10')
    },
    {
        id: 'game6',
        title: 'Duel Masters',
        creator: 'CardCollector',
        description: 'A competitive card game with strategic deck building and tournament play.',
        genre: 'competitive',
        complexity: 'moderate',
        rating: 4.6,
        players: 7500,
        assets: 890,
        volume: 45200,
        platforms: ['web3', 'pc', 'mobile'],
        image: 'https://images.unsplash.com/photo-1603731035952-3a887fde2dfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        createdAt: new Date('2025-04-05')
    },
    {
        id: 'game7',
        title: 'Mech Constructor',
        creator: 'RobotEngineer',
        description: 'A sandbox game where players design, build, and battle with custom mechs.',
        genre: 'sandbox',
        complexity: 'complex',
        rating: 4.4,
        players: 2800,
        assets: 750,
        volume: 23800,
        platforms: ['web3', 'pc'],
        image: 'https://images.unsplash.com/photo-1561488111-950c8cae9222?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        createdAt: new Date('2025-03-22')
    },
    {
        id: 'game8',
        title: 'Trade Federation',
        creator: 'EconomyWizard',
        description: 'A strategic trading game with complex market simulation and political intrigue.',
        genre: 'strategy',
        complexity: 'complex',
        rating: 4.2,
        players: 1500,
        assets: 380,
        volume: 18200,
        platforms: ['web3', 'pc', 'console'],
        image: 'https://images.unsplash.com/photo-1590859808108-2e38812e3e76?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        createdAt: new Date('2025-03-18')
    }
];

// DOM Elements
const connectWalletBtn = document.getElementById('connectWalletBtn');
const walletInfo = document.getElementById('walletInfo');
const walletIndicator = document.getElementById('walletIndicator');
const walletAddress = document.getElementById('walletAddress');
const gameSearchInput = document.getElementById('gameSearchInput');
const searchBtn = document.getElementById('searchBtn');
const genreFilter = document.getElementById('genreFilter');
const complexityFilter = document.getElementById('complexityFilter');
const sortFilter = document.getElementById('sortFilter');
const platformFilter = document.getElementById('platformFilter');
const activeFilters = document.getElementById('activeFilters');
const gamesGrid = document.getElementById('gamesGrid');
const previousBtn = document.querySelector('.pagination button:first-child');
const nextBtn = document.querySelector('.pagination button:last-child');
const paginationNumbers = document.querySelector('.pagination-numbers');

// State
let currentPage = 1;
let gamesPerPage = 4;
let filteredGames = [...MOCK_GAMES];
let activeFilterTags = new Map(); // Map to store active filters

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initWallet();
    renderGames();
    setupEventListeners();
});

/**
 * Initialize wallet connection
 */
async function initWallet() {
    await wallet.init();
    updateWalletUI();
}

/**
 * Update wallet UI based on connection status
 */
function updateWalletUI() {
    if (wallet.connected) {
        connectWalletBtn.style.display = 'none';
        walletInfo.style.display = 'flex';
        walletIndicator.classList.remove('wallet-disconnected');
        walletIndicator.classList.add('wallet-connected');
        walletAddress.textContent = wallet.getShortAddress();
    } else {
        connectWalletBtn.style.display = 'block';
        walletInfo.style.display = 'none';
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Wallet connection
    connectWalletBtn.addEventListener('click', async () => {
        await wallet.connect();
        updateWalletUI();
    });

    // Wallet events
    wallet.addListener(walletEvent => {
        if (walletEvent.event === 'connect' || walletEvent.event === 'disconnect') {
            updateWalletUI();
        }
    });

    // Search
    searchBtn.addEventListener('click', handleSearch);
    gameSearchInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    // Filters
    genreFilter.addEventListener('change', applyFilters);
    complexityFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
    platformFilter.addEventListener('change', applyFilters);

    // Pagination
    previousBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderGames();
            updatePagination();
        }
    });

    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderGames();
            updatePagination();
        }
    });

    // Handle pagination numbers click
    paginationNumbers.addEventListener('click', event => {
        if (event.target.classList.contains('pagination-number') && !event.target.classList.contains('active')) {
            const pageNumber = event.target.textContent;
            if (pageNumber !== '...') {
                currentPage = parseInt(pageNumber);
                renderGames();
                updatePagination();
            }
        }
    });
}

/**
 * Handle search functionality
 */
function handleSearch() {
    const searchTerm = gameSearchInput.value.trim().toLowerCase();
    
    // Add search as a filter tag if it's not empty
    if (searchTerm) {
        addFilterTag('search', `Search: ${searchTerm}`, searchTerm);
    } else {
        removeFilterTag('search');
    }
    
    applyFilters();
}

/**
 * Apply all filters and sort
 */
function applyFilters() {
    const searchTerm = gameSearchInput.value.trim().toLowerCase();
    const genre = genreFilter.value;
    const complexity = complexityFilter.value;
    const platform = platformFilter.value;
    const sortBy = sortFilter.value;
    
    // Update filter tags
    if (genre !== 'all') {
        const genreText = genreFilter.options[genreFilter.selectedIndex].text;
        addFilterTag('genre', `Genre: ${genreText}`, genre);
    } else {
        removeFilterTag('genre');
    }
    
    if (complexity !== 'all') {
        const complexityText = complexityFilter.options[complexityFilter.selectedIndex].text;
        addFilterTag('complexity', `Complexity: ${complexityText}`, complexity);
    } else {
        removeFilterTag('complexity');
    }
    
    if (platform !== 'all') {
        const platformText = platformFilter.options[platformFilter.selectedIndex].text;
        addFilterTag('platform', `Platform: ${platformText}`, platform);
    } else {
        removeFilterTag('platform');
    }

    // Apply filters
    filteredGames = MOCK_GAMES.filter(game => {
        let matchesSearch = true;
        let matchesGenre = true;
        let matchesComplexity = true;
        let matchesPlatform = true;
        
        if (searchTerm) {
            matchesSearch = (
                game.title.toLowerCase().includes(searchTerm) ||
                game.creator.toLowerCase().includes(searchTerm) ||
                game.description.toLowerCase().includes(searchTerm)
            );
        }
        
        if (genre !== 'all') {
            matchesGenre = game.genre === genre;
        }
        
        if (complexity !== 'all') {
            matchesComplexity = game.complexity === complexity;
        }
        
        if (platform !== 'all') {
            matchesPlatform = game.platforms.includes(platform);
        }
        
        return matchesSearch && matchesGenre && matchesComplexity && matchesPlatform;
    });
    
    // Apply sorting
    switch (sortBy) {
        case 'newest':
            filteredGames.sort((a, b) => b.createdAt - a.createdAt);
            break;
        case 'popular':
            filteredGames.sort((a, b) => b.players - a.players);
            break;
        case 'rating':
            filteredGames.sort((a, b) => b.rating - a.rating);
            break;
        case 'played':
            filteredGames.sort((a, b) => b.players - a.players);
            break;
    }
    
    // Reset to first page and render
    currentPage = 1;
    renderGames();
    updatePagination();
}

/**
 * Add a filter tag to the active filters area
 */
function addFilterTag(key, text, value) {
    // Remove existing filter with the same key if it exists
    removeFilterTag(key, false);
    
    // Create new filter tag
    const tag = document.createElement('div');
    tag.className = 'filter-tag';
    tag.dataset.key = key;
    tag.dataset.value = value;
    
    tag.innerHTML = `
        <span>${text}</span>
        <button class="filter-tag-remove" aria-label="Remove filter">×</button>
    `;
    
    // Add click handler to remove button
    tag.querySelector('.filter-tag-remove').addEventListener('click', () => {
        removeFilterTag(key);
        
        // Reset the corresponding filter control
        switch (key) {
            case 'search':
                gameSearchInput.value = '';
                break;
            case 'genre':
                genreFilter.value = 'all';
                break;
            case 'complexity':
                complexityFilter.value = 'all';
                break;
            case 'platform':
                platformFilter.value = 'all';
                break;
        }
        
        applyFilters();
    });
    
    // Add to active filters and store in map
    activeFilters.appendChild(tag);
    activeFilterTags.set(key, { element: tag, value });
}

/**
 * Remove a filter tag
 */
function removeFilterTag(key, shouldUpdate = true) {
    if (activeFilterTags.has(key)) {
        const tagInfo = activeFilterTags.get(key);
        tagInfo.element.remove();
        activeFilterTags.delete(key);
        
        if (shouldUpdate) {
            applyFilters();
        }
    }
}

/**
 * Render games to the grid
 */
function renderGames() {
    // Clear existing content
    gamesGrid.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    const paginatedGames = filteredGames.slice(startIndex, endIndex);
    
    // Handle empty results
    if (paginatedGames.length === 0) {
        gamesGrid.innerHTML = `
            <div class="no-results">
                <h3>No Games Found</h3>
                <p>Try adjusting your filters or search criteria.</p>
                <button class="btn btn-secondary" id="clearFiltersBtn">Clear All Filters</button>
            </div>
        `;
        
        document.getElementById('clearFiltersBtn').addEventListener('click', clearAllFilters);
        return;
    }
    
    // Render each game card
    paginatedGames.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.dataset.gameId = game.id;
        
        gameCard.innerHTML = `
            <div class="game-image">
                <img src="${game.image}" alt="${game.title}">
            </div>
            <div class="game-content">
                <h4 class="game-title">${game.title}</h4>
                <p class="game-creator">by ${game.creator}</p>
                <div class="game-meta">
                    <span class="game-genre">${capitalizeFirstLetter(game.genre)}</span>
                    <div class="game-rating">
                        <span>${getRatingStars(game.rating)}</span>
                        <span>${game.rating.toFixed(1)}</span>
                    </div>
                </div>
                <p class="game-description">${game.description}</p>
                <div class="game-stats">
                    <div class="game-stat">
                        <div class="game-stat-value">${formatNumber(game.players)}</div>
                        <div class="game-stat-label">Players</div>
                    </div>
                    <div class="game-stat">
                        <div class="game-stat-value">${formatNumber(game.assets)}</div>
                        <div class="game-stat-label">Assets</div>
                    </div>
                    <div class="game-stat">
                        <div class="game-stat-value">${formatNumber(game.volume)}</div>
                        <div class="game-stat-label">$EQIC Volume</div>
                    </div>
                </div>
            </div>
        `;
        
        // Add click handler to game card
        gameCard.addEventListener('click', () => {
            // In a real app, this would navigate to the game details page
            console.log(`Viewing game: ${game.title}`);
        });
        
        gamesGrid.appendChild(gameCard);
    });
}

/**
 * Update pagination display
 */
function updatePagination() {
    const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
    
    // Enable/disable pagination buttons
    previousBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Update pagination numbers
    paginationNumbers.innerHTML = '';
    
    // Function to add a pagination number
    const addPageNumber = (number, isActive = false) => {
        const span = document.createElement('span');
        span.className = 'pagination-number';
        span.textContent = number;
        
        if (isActive) {
            span.classList.add('active');
        }
        
        paginationNumbers.appendChild(span);
    };
    
    // Generate pagination numbers with ellipsis for long ranges
    if (totalPages <= 5) {
        // Show all pages if 5 or fewer
        for (let i = 1; i <= totalPages; i++) {
            addPageNumber(i, i === currentPage);
        }
    } else {
        // Show first page
        addPageNumber(1, currentPage === 1);
        
        // Show ellipsis or numbers
        if (currentPage > 3) {
            addPageNumber('...');
        }
        
        // Show current page and surrounding pages
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);
        
        for (let i = startPage; i <= endPage; i++) {
            addPageNumber(i, i === currentPage);
        }
        
        // Show ellipsis or numbers
        if (currentPage < totalPages - 2) {
            addPageNumber('...');
        }
        
        // Show last page
        addPageNumber(totalPages, currentPage === totalPages);
    }
}

/**
 * Clear all filters and reset the view
 */
function clearAllFilters() {
    // Clear search
    gameSearchInput.value = '';
    
    // Reset filter dropdowns
    genreFilter.value = 'all';
    complexityFilter.value = 'all';
    platformFilter.value = 'all';
    sortFilter.value = 'newest';
    
    // Clear all filter tags
    activeFilters.innerHTML = '';
    activeFilterTags.clear();
    
    // Reset and render
    filteredGames = [...MOCK_GAMES];
    currentPage = 1;
    renderGames();
    updatePagination();
}

/**
 * Helper function to generate star rating display
 */
function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '★'.repeat(fullStars);
    stars += halfStar ? '★' : '';
    stars += '☆'.repeat(emptyStars);
    
    return stars;
}

/**
 * Helper function to format numbers (e.g., 1200 -> 1.2k)
 */
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

/**
 * Helper function to capitalize first letter
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Add some additional styling for the filter tags
const style = document.createElement('style');
style.textContent = `
    .active-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .filter-tag {
        display: inline-flex;
        align-items: center;
        background: rgba(123, 104, 238, 0.15);
        color: var(--primary-color);
        padding: 0.25rem 0.5rem;
        border-radius: var(--border-radius-full);
        font-size: var(--font-size-sm);
    }
    
    .filter-tag-remove {
        background: none;
        border: none;
        color: var(--primary-color);
        cursor: pointer;
        font-size: 1.2rem;
        line-height: 1;
        padding: 0 0 0 0.25rem;
        min-width: auto;
    }
    
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem 1rem;
    }
    
    .no-results h3 {
        margin-bottom: 0.5rem;
    }
    
    .no-results p {
        margin-bottom: 1.5rem;
    }
    
    .hero-section {
        background: var(--dark-gradient);
        padding: 3rem 2rem;
        border-radius: var(--border-radius-lg);
        margin-bottom: 2rem;
        text-align: center;
    }
    
    .hero-content h2 {
        font-size: var(--font-size-xxxl);
        margin-bottom: 1rem;
        background: linear-gradient(to right, var(--primary-color), var(--accent-color));
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }
    
    .hero-search {
        max-width: 600px;
        margin: 2rem auto 0;
        display: flex;
    }
    
    .hero-search input {
        flex: 1;
        border-radius: var(--border-radius-md) 0 0 var(--border-radius-md);
    }
    
    .hero-search button {
        border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;
    }
    
    .filters-section {
        background-color: var(--card-bg);
        padding: 1.5rem;
        border-radius: var(--border-radius-md);
        margin-bottom: 2rem;
    }
    
    .filters {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .a2a-section {
        background-color: var(--card-bg);
        padding: 2rem;
        border-radius: var(--border-radius-md);
        margin: 3rem 0;
        text-align: center;
    }
    
    .a2a-platforms {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }
    
    .a2a-platform {
        background-color: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: var(--border-radius-md);
        text-align: center;
    }
    
    .a2a-platform-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 1rem;
        border-radius: 50%;
        background-color: rgba(123, 104, 238, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .a2a-platform-icon img {
        width: 50px;
        height: 50px;
        object-fit: contain;
    }
    
    .a2a-platform h4 {
        margin-bottom: 0.5rem;
    }
    
    .a2a-platform p {
        margin-bottom: 1.5rem;
    }
    
    .featured-games {
        margin-bottom: 3rem;
    }
    
    .featured-game {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 2rem;
        background-color: var(--card-bg);
        border-radius: var(--border-radius-md);
        overflow: hidden;
    }
    
    .featured-game-image {
        height: 300px;
    }
    
    .featured-game-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .featured-game-content {
        padding: 2rem;
    }
    
    .featured-game-content h4 {
        font-size: var(--font-size-xxl);
        margin-bottom: 1rem;
    }
    
    .featured-game-meta {
        display: flex;
        gap: 0.5rem;
        margin: 1.5rem 0;
    }
    
    @media (max-width: 768px) {
        .featured-game {
            grid-template-columns: 1fr;
        }
        
        .featured-game-image {
            height: 200px;
        }
    }
    
    .main-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem 0;
        margin-bottom: 2rem;
    }
    
    .header-logo {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .header-logo img {
        width: 50px;
        height: 50px;
    }
    
    .header-logo h1 {
        margin: 0;
        font-size: var(--font-size-xl);
    }
    
    .main-nav {
        display: flex;
        gap: 0.5rem;
    }
    
    .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 2rem;
    }
    
    .pagination-numbers {
        display: flex;
        margin: 0 1rem;
    }
    
    .pagination-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: var(--border-radius-full);
        cursor: pointer;
        margin: 0 0.25rem;
        transition: var(--transition-fast);
    }
    
    .pagination-number:hover {
        background-color: rgba(255, 255, 255, 0.05);
    }
    
    .pagination-number.active {
        background-color: var(--primary-color);
        color: white;
    }
    
    .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }
    
    .footer-links {
        list-style: none;
        padding: 0;
    }
    
    .footer-links li {
        margin-bottom: 0.5rem;
    }
    
    .footer-links a {
        color: var(--text-secondary);
        text-decoration: none;
        transition: var(--transition-fast);
    }
    
    .footer-links a:hover {
        color: var(--primary-color);
    }
    
    .footer-bottom {
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
        text-align: center;
    }
    
    .social-links {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .social-link {
        color: var(--text-secondary);
        text-decoration: none;
        transition: var(--transition-fast);
    }
    
    .social-link:hover {
        color: var(--primary-color);
    }
`;

document.head.appendChild(style); 