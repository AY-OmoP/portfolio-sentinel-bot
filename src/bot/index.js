const { Telegraf } = require("telegraf");
const { ethers } = require("ethers");
const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

console.log("🚀 Portfolio Sentinel Bot - Full Version Running on Railway");

const provider = new ethers.JsonRpcProvider(ALCHEMY_API_KEY);
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  const welcomeMessage = `🤖 <b>Portfolio Sentinel</b>
  
🚀 Successfully deployed on Railway
✅ 24/7 operation enabled
💰 Real-time blockchain data

<b>Commands:</b>
/portfolio <code>&lt;address&gt;</code> - Portfolio summary
/status - Bot status
/help - Help guide

<b>Example:</b>
<code>/portfolio 0x742d35Cc6634C0532925a3b844Bc454e4438f44e</code>`;

  ctx.reply(welcomeMessage, { parse_mode: "HTML" });
});

bot.help((ctx) => {
  ctx.reply(
    "Available commands:\n/start - Welcome\n/portfolio <address> - Portfolio analysis\n/status - Bot status"
  );
});

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
<b>ETH Price:</b> $${ethPrice}
<b>ETH Value:</b> $${ethValue}

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
      "❌ Error analyzing wallet. Please try again."
    );
  }
});

bot.command("status", (ctx) => {
  ctx.reply(
    "🟢 Status: Operational\n🌐 Host: Railway\n⏰ Uptime: 24/7\n🚀 Version: 1.0"
  );
});

// Error handling
bot.catch((err, ctx) => {
  console.error("Bot error:", err);
  ctx.reply("❌ An error occurred. Please try again.");
});

console.log("✅ Launching full portfolio bot...");
bot.launch().then(() => {
  console.log("🎉 Portfolio Sentinel Bot fully operational on Railway!");
});

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
