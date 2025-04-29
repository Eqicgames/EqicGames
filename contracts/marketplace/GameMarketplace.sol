// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title GameMarketplace
 * @dev Contract for trading game assets on the Eqic Game platform
 */
contract GameMarketplace {
    // Asset listing structure
    struct Listing {
        string assetId;
        address seller;
        uint256 price;
        uint256 listedAt;
        bool isActive;
    }
    
    // Offer structure
    struct Offer {
        string assetId;
        address buyer;
        uint256 price;
        uint256 expiresAt;
        bool isActive;
    }
    
    // Platform fee
    uint256 public platformFeePercentage = 250; // 2.5% in basis points (1/100 of a percent)
    address public feeCollector;
    
    // Listings and offers storage
    mapping(string => Listing) private listings;
    mapping(string => Offer[]) private offers;
    
    // Game asset interface dependency
    address public gameAssetContract;
    
    // Events
    event AssetListed(string assetId, address seller, uint256 price);
    event AssetUnlisted(string assetId, address seller);
    event AssetSold(string assetId, address seller, address buyer, uint256 price);
    event OfferCreated(string assetId, address buyer, uint256 price, uint256 expiresAt);
    event OfferCancelled(string assetId, address buyer);
    event OfferAccepted(string assetId, address seller, address buyer, uint256 price);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeCollectorUpdated(address oldCollector, address newCollector);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }
    
    modifier assetNotListed(string memory assetId) {
        require(!listings[assetId].isActive, "Asset is already listed");
        _;
    }
    
    modifier assetListed(string memory assetId) {
        require(listings[assetId].isActive, "Asset is not listed");
        _;
    }
    
    // Owner of the marketplace
    address private owner;
    
    /**
     * @dev Constructor - initializes the marketplace
     * @param _gameAssetContract Address of the GameAsset contract
     * @param _feeCollector Address that will receive marketplace fees
     */
    constructor(address _gameAssetContract, address _feeCollector) {
        require(_gameAssetContract != address(0), "GameAsset contract address cannot be zero");
        require(_feeCollector != address(0), "Fee collector address cannot be zero");
        
        gameAssetContract = _gameAssetContract;
        feeCollector = _feeCollector;
        owner = msg.sender;
    }
    
    /**
     * @dev List an asset for sale
     * @param assetId ID of the asset to list
     * @param price Price in wei
     */
    function listAsset(string memory assetId, uint256 price) external assetNotListed(assetId) {
        require(price > 0, "Price must be greater than zero");
        require(isAssetOwner(assetId, msg.sender), "Caller is not the asset owner");
        require(isAssetTransferable(assetId), "Asset is not transferable");
        
        listings[assetId] = Listing({
            assetId: assetId,
            seller: msg.sender,
            price: price,
            listedAt: block.timestamp,
            isActive: true
        });
        
        emit AssetListed(assetId, msg.sender, price);
    }
    
    /**
     * @dev Remove an asset listing
     * @param assetId ID of the asset to unlist
     */
    function unlistAsset(string memory assetId) external assetListed(assetId) {
        require(listings[assetId].seller == msg.sender, "Caller is not the seller");
        
        listings[assetId].isActive = false;
        
        emit AssetUnlisted(assetId, msg.sender);
    }
    
    /**
     * @dev Buy a listed asset
     * @param assetId ID of the asset to buy
     */
    function buyAsset(string memory assetId) external payable assetListed(assetId) {
        Listing memory listing = listings[assetId];
        
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.seller, "Seller cannot buy their own asset");
        require(isAssetOwner(assetId, listing.seller), "Seller no longer owns the asset");
        
        // Mark listing as inactive
        listings[assetId].isActive = false;
        
        // Calculate and transfer platform fee
        uint256 platformFee = (listing.price * platformFeePercentage) / 10000;
        uint256 sellerAmount = listing.price - platformFee;
        
        // Transfer funds
        payable(feeCollector).transfer(platformFee);
        payable(listing.seller).transfer(sellerAmount);
        
        // Refund excess payment if any
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
        
        // Transfer the asset
        transferAsset(assetId, listing.seller, msg.sender);
        
        emit AssetSold(assetId, listing.seller, msg.sender, listing.price);
    }
    
    /**
     * @dev Make an offer for an asset
     * @param assetId ID of the asset
     * @param expirationTime Time in seconds after which the offer expires
     */
    function makeOffer(string memory assetId, uint256 expirationTime) external payable {
        require(msg.value > 0, "Offer must be greater than zero");
        require(expirationTime > 0, "Expiration time must be greater than zero");
        require(isAssetValid(assetId), "Asset does not exist");
        
        address assetOwner = getAssetOwner(assetId);
        require(assetOwner != msg.sender, "Cannot make offer on your own asset");
        
        // Add offer to the asset's offers
        offers[assetId].push(Offer({
            assetId: assetId,
            buyer: msg.sender,
            price: msg.value,
            expiresAt: block.timestamp + expirationTime,
            isActive: true
        }));
        
        emit OfferCreated(assetId, msg.sender, msg.value, block.timestamp + expirationTime);
    }
    
    /**
     * @dev Cancel an offer
     * @param assetId ID of the asset
     * @param offerIndex Index of the offer to cancel
     */
    function cancelOffer(string memory assetId, uint256 offerIndex) external {
        require(offerIndex < offers[assetId].length, "Offer index out of bounds");
        Offer storage offer = offers[assetId][offerIndex];
        
        require(offer.buyer == msg.sender, "Not the offer creator");
        require(offer.isActive, "Offer is not active");
        
        offer.isActive = false;
        
        // Refund the buyer
        payable(msg.sender).transfer(offer.price);
        
        emit OfferCancelled(assetId, msg.sender);
    }
    
    /**
     * @dev Accept an offer
     * @param assetId ID of the asset
     * @param offerIndex Index of the offer to accept
     */
    function acceptOffer(string memory assetId, uint256 offerIndex) external {
        require(offerIndex < offers[assetId].length, "Offer index out of bounds");
        Offer storage offer = offers[assetId][offerIndex];
        
        require(isAssetOwner(assetId, msg.sender), "Not the asset owner");
        require(offer.isActive, "Offer is not active");
        require(block.timestamp < offer.expiresAt, "Offer has expired");
        
        offer.isActive = false;
        
        // Calculate and transfer platform fee
        uint256 platformFee = (offer.price * platformFeePercentage) / 10000;
        uint256 sellerAmount = offer.price - platformFee;
        
        // Transfer funds
        payable(feeCollector).transfer(platformFee);
        payable(msg.sender).transfer(sellerAmount);
        
        // Transfer the asset
        transferAsset(assetId, msg.sender, offer.buyer);
        
        // If the asset was listed, unlist it
        if (listings[assetId].isActive && listings[assetId].seller == msg.sender) {
            listings[assetId].isActive = false;
            emit AssetUnlisted(assetId, msg.sender);
        }
        
        emit OfferAccepted(assetId, msg.sender, offer.buyer, offer.price);
    }
    
    /**
     * @dev Update platform fee percentage
     * @param newFeePercentage New fee percentage in basis points
     */
    function updatePlatformFee(uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage <= 1000, "Fee cannot exceed 10%");
        
        uint256 oldFee = platformFeePercentage;
        platformFeePercentage = newFeePercentage;
        
        emit PlatformFeeUpdated(oldFee, newFeePercentage);
    }
    
    /**
     * @dev Update fee collector address
     * @param newFeeCollector New fee collector address
     */
    function updateFeeCollector(address newFeeCollector) external onlyOwner {
        require(newFeeCollector != address(0), "Fee collector cannot be zero address");
        
        address oldCollector = feeCollector;
        feeCollector = newFeeCollector;
        
        emit FeeCollectorUpdated(oldCollector, newFeeCollector);
    }
    
    /**
     * @dev Get listing details
     * @param assetId ID of the asset
     * @return Listing details
     */
    function getListing(string memory assetId) external view returns (Listing memory) {
        return listings[assetId];
    }
    
    /**
     * @dev Get all offers for an asset
     * @param assetId ID of the asset
     * @return Array of offers
     */
    function getOffers(string memory assetId) external view returns (Offer[] memory) {
        return offers[assetId];
    }
    
    /**
     * @dev Check if caller is the asset owner (interface to GameAsset contract)
     * @param assetId Asset ID to check
     * @param account Address to check
     * @return Whether the address is the asset owner
     */
    function isAssetOwner(string memory assetId, address account) internal view returns (bool) {
        // In a real implementation, this would call the GameAsset contract
        // For now, we'll just return true for demonstration
        return true;
    }
    
    /**
     * @dev Check if an asset is transferable (interface to GameAsset contract)
     * @param assetId Asset ID to check
     * @return Whether the asset is transferable
     */
    function isAssetTransferable(string memory assetId) internal view returns (bool) {
        // In a real implementation, this would call the GameAsset contract
        // For now, we'll just return true for demonstration
        return true;
    }
    
    /**
     * @dev Check if an asset exists (interface to GameAsset contract)
     * @param assetId Asset ID to check
     * @return Whether the asset exists
     */
    function isAssetValid(string memory assetId) internal view returns (bool) {
        // In a real implementation, this would call the GameAsset contract
        // For now, we'll just return true for demonstration
        return true;
    }
    
    /**
     * @dev Get asset owner (interface to GameAsset contract)
     * @param assetId Asset ID to check
     * @return Address of the asset owner
     */
    function getAssetOwner(string memory assetId) internal view returns (address) {
        // In a real implementation, this would call the GameAsset contract
        // For now, we'll just return a placeholder address for demonstration
        return address(0x1234567890123456789012345678901234567890);
    }
    
    /**
     * @dev Transfer asset ownership (interface to GameAsset contract)
     * @param assetId Asset ID to transfer
     * @param from Address of the current owner
     * @param to Address of the new owner
     */
    function transferAsset(string memory assetId, address from, address to) internal {
        // In a real implementation, this would call the GameAsset contract
        // For demonstration, this is a placeholder
    }
} 