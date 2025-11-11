// config/constants.js
module.exports = {
  // Supported blockchains
  CHAINS: {
    ETHEREUM: {
      name: "Ethereum",
      symbol: "ETH",
      rpcUrl: process.env.ALCHEMY_API_KEY,
      explorer: "https://etherscan.io",
    },
    // Add more chains later: POLYGON, BSC, etc.
  },

  // API endpoints
  APIs: {
    COINGECKO: "https://api.coingecko.com/api/v3",
    ALCHEMY: process.env.ALCHEMY_API_KEY,
  },

  // Bot settings
  BOT_SETTINGS: {
    defaultCurrency: "USD",
    updateInterval: 300000, // 5 minutes
    maxTokensToShow: 10,
  },
};
