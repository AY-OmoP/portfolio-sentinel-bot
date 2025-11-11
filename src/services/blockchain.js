const { ethers } = require('ethers');
const axios = require('axios');

// Initialize provider (using free public RPC for now)
const provider = new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/demo');

class BlockchainService {
  
  // Get native balance (ETH)
  static async getNativeBalance(walletAddress) {
    try {
      console.log(`🔍 Fetching ETH balance for: ${walletAddress}`);
      const balanceWei = await provider.getBalance(walletAddress);
      const balanceEth = ethers.formatEther(balanceWei);
      return parseFloat(balanceEth);
    } catch (error) {
      console.error('Error getting native balance:', error);
      return 0;
    }
  }

  // Get token balances using Alchemy's API
  static async getTokenBalances(walletAddress) {
    try {
      console.log(`🔍 Fetching token balances for: ${walletAddress}`);
      // For now, return empty array - we'll implement this later
      return [];
    } catch (error) {
      console.error('Error getting token balances:', error);
      return [];
    }
  }
}

module.exports = BlockchainService;
