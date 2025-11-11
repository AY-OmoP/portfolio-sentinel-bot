const { Telegraf } = require("telegraf");
const { ethers } = require("ethers");

console.log("🚀 Starting Portfolio Sentinel Bot on Railway...");

// Get environment variables directly from Railway
const BOT_TOKEN = process.env.BOT_TOKEN;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

console.log("Environment Check:");
console.log("- BOT_TOKEN exists:", !!BOT_TOKEN);
console.log("- ALCHEMY_API_KEY exists:", !!ALCHEMY_API_KEY);
console.log("- RAILWAY_ENVIRONMENT:", process.env.RAILWAY_ENVIRONMENT_NAME);

if (!BOT_TOKEN) {
  console.error(
    "ERROR: BOT_TOKEN is required but not found in environment variables"
  );
  console.error("Please add BOT_TOKEN in Railway dashboard → Variables");
  process.exit(1);
}

try {
  console.log("Initializing Telegram bot...");
  const bot = new Telegraf(BOT_TOKEN);

  // Simple start command
  bot.start((ctx) => {
    ctx.reply(
      "🎉 Portfolio Sentinel Bot is now live on Railway!\\n\\nUse /portfolio <address> to check wallet balances."
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
      return ctx.reply("❌ Invalid Ethereum address format.");
    }

    ctx.reply(
      `✅ Analyzing: ${walletAddress}\\n\\n🚀 Bot deployed on Railway!\\n💫 Real blockchain data coming soon!`
    );
  });

  // Status command
  bot.command("status", (ctx) => {
    ctx.reply("🟢 Status: Operational\\n🌐 Host: Railway\\n⏰ Uptime: 24/7");
  });

  console.log("Launching bot...");

  bot.launch().then(() => {
    console.log("✅ SUCCESS: Bot is now running on Railway!");
    console.log("🤖 Bot: @PortfolioSentinelBot");
  });

  // Graceful shutdown
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
} catch (error) {
  console.error("Bot startup failed:", error);
  process.exit(1);
}
