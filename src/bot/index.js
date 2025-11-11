const { Telegraf } = require("telegraf");
const { ethers } = require("ethers");
const axios = require("axios");

console.log("🚀 Portfolio Sentinel Bot starting on Railway...");

const BOT_TOKEN = process.env.BOT_TOKEN;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN missing");
  process.exit(1);
}

// Initialize provider
const provider = new ethers.JsonRpcProvider(ALCHEMY_API_KEY);

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "🤖 Portfolio Sentinel Bot\n🚀 Deployed on Railway\n✅ 24/7 Operational\n\nUse /portfolio <address> to analyze wallets"
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
    // Get real ETH balance
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
<b>ETH Value:</b> $${ethValue}

<em>✅ Real blockchain data from Railway!</em>`;

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
      "❌ Error fetching data. Please try again."
    );
  }
});

bot.command("status", (ctx) => {
  ctx.reply(
    "🟢 Status: Operational\n🌐 Host: Railway\n⏰ Uptime: 24/7\n🚀 Version: Deployed"
  );
});

console.log("✅ Launching bot...");
bot.launch().then(() => {
  console.log("🎉 Portfolio Sentinel Bot is running on Railway!");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
