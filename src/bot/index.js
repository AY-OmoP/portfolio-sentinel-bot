require("dotenv").config();
const { Telegraf } = require("telegraf");
const { ethers } = require("ethers");

// Debug: Check if environment variables are loaded
console.log("🔧 Environment Check:");
console.log(
  "BOT_TOKEN length:",
  process.env.BOT_TOKEN ? process.env.BOT_TOKEN.length : "MISSING"
);
console.log(
  "ALCHEMY_API_KEY length:",
  process.env.ALCHEMY_API_KEY ? process.env.ALCHEMY_API_KEY.length : "MISSING"
);
console.log(
  "RAILWAY_ENVIRONMENT_NAME:",
  process.env.RAILWAY_ENVIRONMENT_NAME || "Not set"
);

// Check if BOT_TOKEN exists - FIXED for Railway
if (!process.env.BOT_TOKEN) {
  console.error("❌ ERROR: BOT_TOKEN environment variable is missing!");
  console.error("💡 Please set BOT_TOKEN in Railway Variables tab");
  console.error("💡 Current environment:", process.env.NODE_ENV);
  process.exit(1);
}

try {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  console.log("✅ Bot token is valid!");
  console.log("🚀 Starting Portfolio Sentinel Bot on Railway...");

  // Start command
  bot.start((ctx) => {
    const welcomeMessage = `🤖 <b>Welcome to Portfolio Sentinel</b>

🚀 Successfully deployed on Railway!
✅ 24/7 operation enabled

<b>Available Commands:</b>
/portfolio <code>&lt;wallet_address&gt;</code> - Get portfolio summary
/status - Check bot status
/help - Show help guide

<b>Example:</b>
<code>/portfolio 0x742d35Cc6634C0532925a3b844Bc454e4438f44e</code>`;

    ctx.reply(welcomeMessage, { parse_mode: "HTML" });
  });

  // Status command to check if bot is working
  bot.command("status", (ctx) => {
    ctx.reply(
      "✅ Portfolio Sentinel Bot is running on Railway!\n🟢 Status: Operational\n⏰ 24/7: Enabled"
    );
  });

  // Portfolio command
  bot.command("portfolio", async (ctx) => {
    const messageParts = ctx.message.text.split(" ");

    if (messageParts.length < 2) {
      return ctx.reply(
        "Please provide a wallet address. Example: /portfolio 0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
      );
    }

    const walletAddress = messageParts[1];

    if (!ethers.isAddress(walletAddress)) {
      return ctx.reply("❌ Invalid Ethereum address.");
    }

    const processingMsg = await ctx.reply("🔍 Scanning wallet on Railway...");

    try {
      // Simple response for now - we'll add real blockchain data next
      const result = `<b>📊 Portfolio Summary</b>
      
<b>Wallet:</b> <code>${walletAddress}</code>
<b>Status:</b> ✅ Bot deployed on Railway!
<b>Environment:</b> ${process.env.RAILWAY_ENVIRONMENT_NAME || "Production"}

<em>🔧 Real blockchain data coming in next update!</em>`;

      await ctx.telegram.editMessageText(
        ctx.chat.id,
        processingMsg.message_id,
        null,
        result,
        { parse_mode: "HTML" }
      );
    } catch (error) {
      console.error("Portfolio command error:", error);
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        processingMsg.message_id,
        null,
        "❌ Error analyzing wallet. Please try again."
      );
    }
  });

  // Help command
  bot.help((ctx) => {
    ctx.reply(
      "Available commands:\n/start - Welcome\n/portfolio <address> - Portfolio summary\n/status - Bot status\n/help - This message"
    );
  });

  // Error handling
  bot.catch((err, ctx) => {
    console.error("Bot error:", err);
    ctx.reply("❌ An error occurred. Please try again.");
  });

  // Start the bot
  bot
    .launch()
    .then(() => {
      console.log("✅ Portfolio Sentinel Bot is now running on Railway!");
      console.log("🤖 Bot username: @PortfolioSentinelBot");
      console.log(
        "🌐 Railway Environment:",
        process.env.RAILWAY_ENVIRONMENT_NAME
      );
    })
    .catch((error) => {
      console.error("❌ Failed to start bot:", error);
      process.exit(1);
    });

  // Enable graceful stop
  process.once("SIGINT", () => {
    console.log("🛑 Stopping bot gracefully...");
    bot.stop("SIGINT");
  });
  process.once("SIGTERM", () => {
    console.log("🛑 Stopping bot gracefully...");
    bot.stop("SIGTERM");
  });
} catch (error) {
  console.error("❌ Bot initialization failed:", error);
  process.exit(1);
}
