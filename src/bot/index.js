const { Telegraf } = require("telegraf");
const { ethers } = require("ethers");
const axios = require("axios");

// Direct token
const BOT_TOKEN = "8560901651:AAGkgC4XqUhQ3O3MM0q_n3yKO8locxLQcZw";
const ALCHEMY_API_KEY = "https://eth-mainnet.g.alchemy.com/v2/demo";

console.log("🚀 Portfolio Sentinel Bot - Starting on Railway...");

// Add error handling for multiple instances
process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception:", error);
});

async function startBot() {
  try {
    const provider = new ethers.JsonRpcProvider(ALCHEMY_API_KEY);
    const bot = new Telegraf(BOT_TOKEN);

    // Configure bot to handle multiple instances
    bot.telegram
      .getMe()
      .then((botInfo) => {
        console.log(`✅ Bot authorized as: ${botInfo.username}`);
      })
      .catch((error) => {
        console.error("❌ Bot authorization failed:", error.message);
        process.exit(1);
      });

    bot.start((ctx) => {
      const welcomeMessage = `🤖 <b>Portfolio Sentinel</b>
      
🚀 Successfully deployed on Railway
✅ 24/7 operation enabled

<b>How to use:</b>
• Send any Ethereum wallet address
• Or use /portfolio <code>&lt;address&gt;</code>

<b>Example:</b>
<code>0x742d35Cc6634C0532925a3b844Bc454e4438f44e</code>`;

      ctx.reply(welcomeMessage, { parse_mode: "HTML" });
    });

    // Handle portfolio command
    bot.command("portfolio", async (ctx) => {
      await processWalletAnalysis(ctx);
    });

    // Handle plain wallet addresses
    bot.on("text", async (ctx) => {
      const text = ctx.message.text.trim();

      if (ethers.isAddress(text)) {
        console.log("Detected wallet address:", text);
        await processWalletAnalysis(ctx, text);
      } else if (!text.startsWith("/")) {
        ctx.reply("Please send an Ethereum wallet address or use /help");
      }
    });

    // Portfolio analysis function
    async function processWalletAnalysis(ctx, customAddress = null) {
      let walletAddress = customAddress;

      if (!walletAddress) {
        const messageParts = ctx.message.text.split(" ");
        if (messageParts.length < 2) {
          return ctx.reply(
            "Please provide a wallet address. Example: /portfolio 0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
          );
        }
        walletAddress = messageParts[1];
      }

      if (!ethers.isAddress(walletAddress)) {
        return ctx.reply("❌ Invalid Ethereum address.");
      }

      const processingMsg = await ctx.reply(`🔍 Scanning wallet...`);

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
<b>ETH Value:</b> $${parseFloat(ethValue).toLocaleString()}

<em>✅ Real blockchain data</em>`;

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
          "❌ Error analyzing wallet. Please try again."
        );
      }
    }

    bot.command("status", (ctx) => {
      ctx.reply("🟢 Status: Operational\n🌐 Host: Railway\n⏰ Uptime: 24/7");
    });

    console.log("✅ Starting bot with webhook...");

    // Use webhook mode which is better for Railway
    await bot.launch({
      webhook: {
        domain: process.env.RAILWAY_PUBLIC_DOMAIN,
        port: process.env.PORT || 3000,
      },
    });

    console.log("🎉 Portfolio Sentinel Bot is now running on Railway!");
    console.log("🤖 Bot ready to receive messages");
  } catch (error) {
    console.error("❌ Bot startup failed:", error.message);

    // If it's a conflict error, wait and retry
    if (error.message.includes("Conflict") || error.message.includes("409")) {
      console.log("🔄 Multiple instance detected, waiting 10 seconds...");
      setTimeout(startBot, 10000);
    } else {
      process.exit(1);
    }
  }
}

// Start the bot
startBot();
