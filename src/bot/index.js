const { Telegraf } = require("telegraf");
const { ethers } = require("ethers");
const axios = require("axios");

// Direct token
const BOT_TOKEN = "8560901651:AAGkgC4XqUhQ3O3MM0q_n3yKO8locxLQcZw";
const ALCHEMY_API_KEY = "https://eth-mainnet.g.alchemy.com/v2/demo";

console.log("🚀 Portfolio Sentinel Bot - Running on Railway");

try {
  const provider = new ethers.JsonRpcProvider(ALCHEMY_API_KEY);
  const bot = new Telegraf(BOT_TOKEN);

  bot.start((ctx) => {
    const welcomeMessage = `🤖 <b>Portfolio Sentinel</b>
    
🚀 Successfully deployed on Railway
✅ 24/7 operation enabled
💰 Real-time blockchain data

<b>How to use:</b>
1. Send any Ethereum wallet address
2. Or use /portfolio <code>&lt;address&gt;</code>
3. Use /status to check bot health

<b>Example addresses to test:</b>
<code>0x742d35Cc6634C0532925a3b844Bc454e4438f44e</code>
<code>0x3a746d7c93e96830066cf5cf23109a389c657e28</code>`;

    ctx.reply(welcomeMessage, { parse_mode: "HTML" });
  });

  // Handle portfolio command
  bot.command("portfolio", async (ctx) => {
    await processWalletAnalysis(ctx);
  });

  // Handle plain text messages (wallet addresses)
  bot.on("text", async (ctx) => {
    const text = ctx.message.text.trim();

    // Check if it looks like a wallet address
    if (ethers.isAddress(text)) {
      console.log("Detected wallet address:", text);
      await processWalletAnalysis(ctx, text);
    } else if (!text.startsWith("/")) {
      // If it's not a command and not a wallet address, show help
      ctx.reply(
        "🤔 I see you sent a message. Please send an Ethereum wallet address or use /help for commands."
      );
    }
  });

  // Portfolio analysis function
  async function processWalletAnalysis(ctx, customAddress = null) {
    let walletAddress = customAddress;

    // If no custom address provided, get from command
    if (!walletAddress) {
      const messageParts = ctx.message.text.split(" ");
      if (messageParts.length < 2) {
        return ctx.reply(
          "Please provide a wallet address. Example: /portfolio 0x742d35Cc6634C0532925a3b844Bc454e4438f44e\n\nOr simply paste any Ethereum address!"
        );
      }
      walletAddress = messageParts[1];
    }

    if (!ethers.isAddress(walletAddress)) {
      return ctx.reply(
        "❌ Invalid Ethereum address format. Please check and try again."
      );
    }

    const processingMsg = await ctx.reply(
      `🔍 Scanning wallet: ${walletAddress}...`
    );

    try {
      // Get ETH balance
      const balanceWei = await provider.getBalance(walletAddress);
      const balanceEth = ethers.formatEther(balanceWei);

      // Get ETH price
      const priceResponse = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const ethPrice = priceResponse.data.ethereum.usd;
      const ethValue = (parseFloat(balanceEth) * ethPrice).toFixed(2);

      const result = `📊 <b>Portfolio Summary</b>

<b>Wallet:</b> <code>${walletAddress}</code>
<b>ETH Balance:</b> ${parseFloat(balanceEth).toFixed(6)} ETH
<b>ETH Price:</b> $${ethPrice.toLocaleString()}
<b>ETH Value:</b> $${ethValue.toLocaleString()}

<em>✅ Real-time data from Railway deployment</em>`;

      await ctx.telegram.editMessageText(
        ctx.chat.id,
        processingMsg.message_id,
        null,
        result,
        { parse_mode: "HTML" }
      );
    } catch (error) {
      console.error("Portfolio error:", error);
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        processingMsg.message_id,
        null,
        "❌ Error analyzing wallet. The blockchain API might be temporarily unavailable. Please try again in a moment."
      );
    }
  }

  bot.command("status", (ctx) => {
    ctx.reply(
      "🟢 Status: Operational\n🌐 Host: Railway\n⏰ Uptime: 24/7\n💰 Real ETH data\n🚀 Version 2.0"
    );
  });

  bot.command("help", (ctx) => {
    ctx.reply(
      `🤖 <b>Portfolio Sentinel Help</b>

<b>Quick Start:</b>
• Send any Ethereum wallet address
• Or use /portfolio <code>&lt;address&gt;</code>

<b>Commands:</b>
/start - Welcome message
/portfolio <code>&lt;address&gt;</code> - Portfolio analysis
/status - Bot status
/help - This message

<b>Example addresses:</b>
<code>0x742d35Cc6634C0532925a3b844Bc454e4438f44e</code>
<code>0x3a746d7c93e96830066cf5cf23109a389c657e28</code>`,
      { parse_mode: "HTML" }
    );
  });

  console.log("✅ Bot initialized, launching...");

  bot
    .launch()
    .then(() => {
      console.log("🎉 Portfolio Sentinel Bot fully operational on Railway!");
    })
    .catch((error) => {
      console.error("❌ Bot launch failed:", error.message);
    });

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
} catch (error) {
  console.error("❌ Bot creation failed:", error.message);
}
