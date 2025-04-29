/**
 * Eqic Games - Wallet Integration
 * Handles Solana wallet connections and interactions
 */

class EqicWallet {
  constructor() {
    this.connected = false;
    this.walletAddress = null;
    this.walletBalance = 0;
    this.provider = null;
    this.walletListeners = [];
  }

  /**
   * Initialize wallet connections
   */
  async init() {
    try {
      // Check if Phantom or Solflare is installed
      const isPhantomInstalled = window.phantom?.solana?.isPhantom || false;
      const isSolflareInstalled = window.solflare?.isSolflare || false;

      if (!isPhantomInstalled && !isSolflareInstalled) {
        console.log('No Solana wallets found. Please install Phantom or Solflare extension');
        return false;
      }

      // Set provider to Phantom or Solflare
      if (isPhantomInstalled) {
        this.provider = window.phantom.solana;
      } else if (isSolflareInstalled) {
        this.provider = window.solflare;
      }

      // Try to auto-connect
      if (this.provider.isConnected) {
        const res = await this.provider.connect({ onlyIfTrusted: true });
        this.connected = true;
        this.walletAddress = res.publicKey.toString();
        this.notifyListeners('connect', { address: this.walletAddress });
        await this.getBalance();
      }

      return true;
    } catch (error) {
      console.error('Error initializing wallet:', error);
      return false;
    }
  }

  /**
   * Connect to wallet
   */
  async connect() {
    try {
      if (!this.provider) {
        await this.init();
        if (!this.provider) return false;
      }

      const res = await this.provider.connect();
      this.connected = true;
      this.walletAddress = res.publicKey.toString();
      this.notifyListeners('connect', { address: this.walletAddress });
      await this.getBalance();
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnect() {
    try {
      if (this.provider && this.connected) {
        await this.provider.disconnect();
        this.connected = false;
        this.walletAddress = null;
        this.walletBalance = 0;
        this.notifyListeners('disconnect');
      }
      return true;
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      return false;
    }
  }

  /**
   * Get wallet SOL balance
   */
  async getBalance() {
    try {
      if (!this.connected || !this.provider) return 0;

      // Simulated balance for prototype
      // In production, would use connection.getBalance(publicKey)
      this.walletBalance = Math.random() * 10;
      this.notifyListeners('balanceChange', { balance: this.walletBalance });
      return this.walletBalance;
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  }

  /**
   * Sign transaction (simplified for prototype)
   */
  async signTransaction(transaction) {
    try {
      if (!this.connected || !this.provider) {
        throw new Error('Wallet not connected');
      }

      // Simulated transaction signing for prototype
      console.log('Signing transaction:', transaction);
      
      // In production, would use provider.signTransaction(transaction)
      return { 
        signature: 'simulated_signature_' + Math.random().toString(36).substring(2, 15),
        success: true 
      };
    } catch (error) {
      console.error('Error signing transaction:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Sign and send transaction (simplified for prototype)
   */
  async sendTransaction(transaction) {
    try {
      if (!this.connected || !this.provider) {
        throw new Error('Wallet not connected');
      }

      // Simulated transaction sending for prototype
      console.log('Sending transaction:', transaction);
      
      // In production, would use provider.signAndSendTransaction(transaction)
      return { 
        signature: 'simulated_signature_' + Math.random().toString(36).substring(2, 15),
        success: true 
      };
    } catch (error) {
      console.error('Error sending transaction:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get shortened wallet address for display
   */
  getShortAddress() {
    if (!this.walletAddress) return '';
    return this.walletAddress.substring(0, 4) + '...' + this.walletAddress.substring(this.walletAddress.length - 4);
  }

  /**
   * Add wallet event listener
   */
  addListener(callback) {
    if (typeof callback === 'function') {
      this.walletListeners.push(callback);
    }
  }

  /**
   * Remove wallet event listener
   */
  removeListener(callback) {
    this.walletListeners = this.walletListeners.filter(listener => listener !== callback);
  }

  /**
   * Notify all listeners of wallet events
   */
  notifyListeners(event, data = {}) {
    this.walletListeners.forEach(listener => {
      listener({ event, ...data });
    });
  }
}

// Create singleton instance
const walletInstance = new EqicWallet();

export default walletInstance; 