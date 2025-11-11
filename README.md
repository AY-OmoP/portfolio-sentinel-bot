# Portfolio Sentinel Bot 🤖

A professional Telegram bot for tracking cryptocurrency portfolios across multiple blockchains. Get real-time portfolio data directly in Telegram without compromising security.

## ✨ Features

- 📊 **Multi-Chain Portfolio Tracking** - Ethereum, Polygon, BSC support
- 💰 **Real-Time Price Data** - Live prices from CoinGecko API
- 🔍 **Wallet Analysis** - Detailed wallet insights and metrics
- 🛡️ **100% Secure** - Read-only access, no private keys needed
- ⚡ **Instant Updates** - Real-time blockchain data
- 🌐 **24/7 Operation** - Always available with cloud deployment

## 🚀 Quick Deployment

### Option 1: Railway (Recommended - Free Tier)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/ygypU3?referralCode=U_3z5A)

1. **Click the "Deploy on Railway" button above**
2. **Connect your GitHub account**
3. **Add environment variables:**
   - `BOT_TOKEN` - From [BotFather](https://t.me/BotFather)
   - `ALCHEMY_API_KEY` - From [Alchemy](https://alchemy.com)
4. **Deploy!** - Your bot will be live in minutes

### Option 2: Manual Deployment

```bash
# Clone repository
git clone https://github.com/AY-OmoP/portfolio-sentinel-bot
cd portfolio-sentinel-bot

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your API keys

# Start the bot
npm start
```
