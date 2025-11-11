require("dotenv").config();
const { Telegraf } = require("telegraf");
const { ethers } = require("ethers");
const BlockchainService = require("../services/blockchain");
const PriceService = require("../services/price");

// Check if BOT_TOKEN exists
if (!process.env.BOT_TOKEN) {
  console.error("❌ ERROR: BOT_TOKEN is missing from .env file");
  process.exit(1);
}

console.log("🔧 Initializing bot...");

try {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  console.log("✅ Bot initialized successfully");

  // Start command
  bot.start((ctx) => {
    const welcomeMessage = `🤖 <b>Welcome to Portfolio Sentinel</b>

I help you track your cryptocurrency portfolio across multiple chains.

<b>Available Commands:</b>
/portfolio <code>&lt;wallet_address&gt;</code> - Get your portfolio summary
/help - Show all commands

<b>Example:</b>
<code>/portfolio 0x742d35Cc6634C0532925a3b844Bc454e4438f44e</code>`;

    ctx.reply(welcomeMessage, { parse_mode: "HTML" });
  });

  // Help command
  bot.help((ctx) => {
    const helpMessage = `<b>Help Guide</b>
    
/portfolio <code>&lt;address&gt;</code> - Get portfolio summary
/help - Show this message`;

    ctx.reply(helpMessage, { parse_mode: "HTML" });
  });

  // Portfolio command with real data
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

    const processingMsg = await ctx.reply("🔍 Scanning wallet...");

    try {
      console.log(`📊 Analyzing: ${walletAddress}`);

      // Get real data
      const ethBalance = await BlockchainService.getNativeBalance(
        walletAddress
      );
      const ethPrice = await PriceService.getETHPrice();
      const ethValue = ethBalance * ethPrice;

      const result = `<b>📊 Portfolio Summary</b>
      
<b>Wallet:</b> <code>${walletAddress}</code>
<b>ETH Balance:</b> ${ethBalance.toFixed(6)} ETH
<b>ETH Price:</b> $${ethPrice.toFixed(2)}
<b>ETH Value:</b> $${ethValue.toFixed(2)}

<em>✅ Real blockchain data loaded!</em>`;

      await ctx.telegram.editMessageText(
        ctx.chat.id,
        processingMsg.message_id,
        null,
        result,
        { parse_mode: "HTML" }
      );
    } catch (error) {
      console.error("Error:", error);
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        processingMsg.message_id,
        null,
        "❌ Error analyzing wallet. Please try again."
      );
    }
  });

  // Handle plain wallet addresses
  bot.on("text", async (ctx) => {
    const text = ctx.message.text.trim();

    if (ethers.isAddress(text)) {
      ctx.reply(
        `I see a wallet address! Use:\n\n<code>/portfolio ${text}</code>\n\nfor portfolio analysis.`,
        { parse_mode: "HTML" }
      );
    }
  });

  // Error handling
  bot.catch((err, ctx) => {
    console.error("Bot error:", err);
    ctx.reply("❌ An error occurred. Please try again.");
  });

  // Start the bot
  console.log("🚀 Starting bot...");
  bot.launch().then(() => {
    console.log("✅ Bot is now running!");
    console.log("🤖 Visit: t.me/PortfolioSentinelBot");
  });

  // Graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
} catch (error) {
  console.error("❌ Failed to initialize bot:", error);
  process.exit(1);
}
