// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title GameAsset
 * @dev Contract for managing game assets on the Eqic Game platform
 */
contract GameAsset {
    // Asset structure
    struct Asset {
        string id;
        string name;
        string assetType; // character, item, environment, collectible
        string rarity; // common, uncommon, rare, epic, legendary
        address creator;
        address owner;
        uint256 creationTime;
        uint256 lastTransferTime;
        string metadataURI;
        bool isTransferable;
    }
    
    // Storage
    mapping(string => Asset) private assets;
    mapping(address => string[]) private userAssets;
    mapping(string => string[]) private gameAssets;
    
    // Game registry
    mapping(string => address) private gameOwners;
    mapping(string => bool) private activeGames;
    
    // Events
    event AssetCreated(string id, string assetType, string rarity, address creator, string game);
    event AssetTransferred(string id, address from, address to);
    event GameRegistered(string gameId, address owner);
    event AssetMetadataUpdated(string id, string metadataURI);
    
    // Modifiers
    modifier onlyAssetOwner(string memory assetId) {
        require(assets[assetId].owner == msg.sender, "Caller is not the asset owner");
        _;
    }
    
    modifier onlyGameOwner(string memory gameId) {
        require(gameOwners[gameId] == msg.sender, "Caller is not the game owner");
        _;
    }
    
    modifier assetExists(string memory assetId) {
        require(bytes(assets[assetId].id).length > 0, "Asset does not exist");
        _;
    }
    
    /**
     * @dev Register a new game
     * @param gameId Unique identifier for the game
     */
    function registerGame(string memory gameId) external {
        require(bytes(gameId).length > 0, "Game ID cannot be empty");
        require(gameOwners[gameId] == address(0), "Game already registered");
        
        gameOwners[gameId] = msg.sender;
        activeGames[gameId] = true;
        
        emit GameRegistered(gameId, msg.sender);
    }
    
    /**
     * @dev Create a new asset
     * @param assetId Unique identifier for the asset
     * @param name Name of the asset
     * @param assetType Type of asset (character, item, environment, collectible)
     * @param rarity Rarity level of the asset
     * @param metadataURI URI pointing to the asset's metadata
     * @param gameId ID of the game this asset belongs to
     * @param isTransferable Whether the asset can be transferred between users
     */
    function createAsset(
        string memory assetId,
        string memory name,
        string memory assetType,
        string memory rarity,
        string memory metadataURI,
        string memory gameId,
        bool isTransferable
    ) external {
        require(bytes(assetId).length > 0, "Asset ID cannot be empty");
        require(bytes(assets[assetId].id).length == 0, "Asset ID already exists");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(
            keccak256(bytes(assetType)) == keccak256(bytes("character")) ||
            keccak256(bytes(assetType)) == keccak256(bytes("item")) ||
            keccak256(bytes(assetType)) == keccak256(bytes("environment")) ||
            keccak256(bytes(assetType)) == keccak256(bytes("collectible")),
            "Invalid asset type"
        );
        require(
            keccak256(bytes(rarity)) == keccak256(bytes("common")) ||
            keccak256(bytes(rarity)) == keccak256(bytes("uncommon")) ||
            keccak256(bytes(rarity)) == keccak256(bytes("rare")) ||
            keccak256(bytes(rarity)) == keccak256(bytes("epic")) ||
            keccak256(bytes(rarity)) == keccak256(bytes("legendary")),
            "Invalid rarity level"
        );
        require(activeGames[gameId], "Game is not active");
        
        // Create the asset
        Asset memory newAsset = Asset({
            id: assetId,
            name: name,
            assetType: assetType,
            rarity: rarity,
            creator: msg.sender,
            owner: msg.sender,
            creationTime: block.timestamp,
            lastTransferTime: block.timestamp,
            metadataURI: metadataURI,
            isTransferable: isTransferable
        });
        
        // Store the asset
        assets[assetId] = newAsset;
        userAssets[msg.sender].push(assetId);
        gameAssets[gameId].push(assetId);
        
        emit AssetCreated(assetId, assetType, rarity, msg.sender, gameId);
    }
    
    /**
     * @dev Transfer an asset to another user
     * @param assetId ID of the asset to transfer
     * @param to Address of the recipient
     */
    function transferAsset(string memory assetId, address to) external onlyAssetOwner(assetId) assetExists(assetId) {
        require(to != address(0), "Cannot transfer to zero address");
        require(to != msg.sender, "Cannot transfer to self");
        require(assets[assetId].isTransferable, "Asset is not transferable");
        
        // Update asset owner
        address previousOwner = assets[assetId].owner;
        assets[assetId].owner = to;
        assets[assetId].lastTransferTime = block.timestamp;
        
        // Update user asset lists
        // Note: This is a simplified implementation that may have gas issues with large arrays
        // A production version would use better data structures
        
        // Remove from previous owner
        for (uint i = 0; i < userAssets[previousOwner].length; i++) {
            if (keccak256(bytes(userAssets[previousOwner][i])) == keccak256(bytes(assetId))) {
                // Replace with the last element and pop
                userAssets[previousOwner][i] = userAssets[previousOwner][userAssets[previousOwner].length - 1];
                userAssets[previousOwner].pop();
                break;
            }
        }
        
        // Add to new owner
        userAssets[to].push(assetId);
        
        emit AssetTransferred(assetId, previousOwner, to);
    }
    
    /**
     * @dev Update asset metadata
     * @param assetId ID of the asset to update
     * @param metadataURI New metadata URI
     */
    function updateAssetMetadata(string memory assetId, string memory metadataURI) 
        external 
        assetExists(assetId) 
    {
        require(
            assets[assetId].creator == msg.sender || 
            assets[assetId].owner == msg.sender,
            "Only creator or owner can update metadata"
        );
        
        assets[assetId].metadataURI = metadataURI;
        
        emit AssetMetadataUpdated(assetId, metadataURI);
    }
    
    /**
     * @dev Get asset details
     * @param assetId ID of the asset to query
     * @return Asset details
     */
    function getAsset(string memory assetId) external view assetExists(assetId) returns (Asset memory) {
        return assets[assetId];
    }
    
    /**
     * @dev Get all assets owned by a user
     * @param user Address of the user
     * @return Array of asset IDs
     */
    function getUserAssets(address user) external view returns (string[] memory) {
        return userAssets[user];
    }
    
    /**
     * @dev Get all assets for a game
     * @param gameId ID of the game
     * @return Array of asset IDs
     */
    function getGameAssets(string memory gameId) external view returns (string[] memory) {
        return gameAssets[gameId];
    }
    
    /**
     * @dev Check if a game is active
     * @param gameId ID of the game
     * @return Whether the game is active
     */
    function isGameActive(string memory gameId) external view returns (bool) {
        return activeGames[gameId];
    }
    
    /**
     * @dev Set game active status
     * @param gameId ID of the game
     * @param active New active status
     */
    function setGameActive(string memory gameId, bool active) external onlyGameOwner(gameId) {
        activeGames[gameId] = active;
    }
} 