// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Solana SPL Token program would typically be interacted with differently
// This is a simplified contract to demonstrate the concepts

/**
 * @title EqicToken
 * @dev Implementation of the Eqic Game Platform Token
 */
contract EqicToken {
    string public name = "Eqic Game Token";
    string public symbol = "EQIC";
    uint8 public decimals = 9;
    uint256 public totalSupply = 1000000000 * 10**9; // 1 billion tokens with 9 decimals
    
    // Token distribution
    uint256 public constant COMMUNITY_ALLOCATION = 500000000 * 10**9; // 50%
    uint256 public constant ECOSYSTEM_FUND = 200000000 * 10**9;       // 20%
    uint256 public constant TEAM_ALLOCATION = 100000000 * 10**9;      // 10%
    uint256 public constant INVESTORS_ALLOCATION = 100000000 * 10**9; // 10%
    uint256 public constant MARKETING_ALLOCATION = 50000000 * 10**9;  // 5%
    uint256 public constant REWARDS_POOL = 50000000 * 10**9;          // 5%
    
    // Distribution addresses
    address public communityWallet;
    address public ecosystemWallet;
    address public teamWallet;
    address public investorsWallet;
    address public marketingWallet;
    address public rewardsWallet;
    
    // Vesting parameters
    uint256 public teamVestingStart;
    uint256 public teamVestingDuration = 365 days * 2; // 2 years
    uint256 public teamVestingReleased;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TokensReleased(address indexed beneficiary, uint256 amount);
    event BuybackExecuted(uint256 amount, uint256 burnAmount);
    
    /**
     * @dev Constructor - initializes the token with wallets and vesting schedule
     */
    constructor(
        address _communityWallet,
        address _ecosystemWallet,
        address _teamWallet,
        address _investorsWallet,
        address _marketingWallet,
        address _rewardsWallet
    ) {
        require(_communityWallet != address(0), "Community wallet cannot be zero address");
        require(_ecosystemWallet != address(0), "Ecosystem wallet cannot be zero address");
        require(_teamWallet != address(0), "Team wallet cannot be zero address");
        require(_investorsWallet != address(0), "Investors wallet cannot be zero address");
        require(_marketingWallet != address(0), "Marketing wallet cannot be zero address");
        require(_rewardsWallet != address(0), "Rewards wallet cannot be zero address");
        
        communityWallet = _communityWallet;
        ecosystemWallet = _ecosystemWallet;
        teamWallet = _teamWallet;
        investorsWallet = _investorsWallet;
        marketingWallet = _marketingWallet;
        rewardsWallet = _rewardsWallet;
        
        teamVestingStart = block.timestamp;
        
        // Initial distribution
        _transfer(address(0), communityWallet, COMMUNITY_ALLOCATION);
        _transfer(address(0), ecosystemWallet, ECOSYSTEM_FUND);
        _transfer(address(0), investorsWallet, INVESTORS_ALLOCATION);
        _transfer(address(0), marketingWallet, MARKETING_ALLOCATION);
        _transfer(address(0), rewardsWallet, REWARDS_POOL);
        
        // Team allocation is vested
        // Will be released gradually over the vesting period
    }
    
    /**
     * @dev Releases vested tokens for the team allocation
     */
    function releaseTeamTokens() public {
        uint256 unreleased = releasableAmount();
        require(unreleased > 0, "No tokens are due for release");
        
        teamVestingReleased += unreleased;
        _transfer(address(0), teamWallet, unreleased);
        
        emit TokensReleased(teamWallet, unreleased);
    }
    
    /**
     * @dev Calculates the amount that has already vested for team allocation
     */
    function releasableAmount() public view returns (uint256) {
        return vestedAmount() - teamVestingReleased;
    }
    
    /**
     * @dev Calculates the amount that has already vested
     */
    function vestedAmount() public view returns (uint256) {
        if (block.timestamp < teamVestingStart) {
            return 0;
        } else if (block.timestamp >= teamVestingStart + teamVestingDuration) {
            return TEAM_ALLOCATION;
        } else {
            return TEAM_ALLOCATION * (block.timestamp - teamVestingStart) / teamVestingDuration;
        }
    }
    
    /**
     * @dev Execute buyback and burn mechanism
     * @param amount Amount of tokens to buy back and burn
     */
    function executeBuyback(uint256 amount) external {
        require(msg.sender == ecosystemWallet, "Only ecosystem wallet can execute buybacks");
        require(amount > 0, "Buyback amount must be greater than 0");
        
        // In a real implementation, this would involve market operations
        // For this simplified version, we just burn from ecosystem fund
        
        // 70% of bought back tokens are burned
        uint256 burnAmount = amount * 70 / 100;
        
        // 30% goes to rewards pool
        uint256 rewardsAmount = amount - burnAmount;
        
        _transfer(ecosystemWallet, address(0), burnAmount); // Burn
        _transfer(ecosystemWallet, rewardsWallet, rewardsAmount); // To rewards
        
        emit BuybackExecuted(amount, burnAmount);
    }
    
    /**
     * @dev Transfer tokens from one address to another
     * @param from The source address
     * @param to The destination address
     * @param value The amount of tokens to transfer
     */
    function _transfer(address from, address to, uint256 value) internal {
        require(to != address(0) || from != address(0), "Invalid transfer");
        
        // In a real implementation, this would interact with the SPL token program
        // This is a simplified placeholder for demonstration purposes
        
        emit Transfer(from, to, value);
    }
} 