// Try multiple ways to get environment variables
const BOT_TOKEN =
  process.env.BOT_TOKEN ||
  process.env.RAILWAY_BOT_TOKEN ||
  "8560901651:AAGkgC4XqUhQ3O3MM0q_n3yKO8locxLQcZw";

const ALCHEMY_API_KEY =
  process.env.ALCHEMY_API_KEY ||
  process.env.RAILWAY_ALCHEMY_API_KEY ||
  "https://eth-mainnet.g.alchemy.com/v2/demo";

console.log("🔧 Debug Info:");
console.log("BOT_TOKEN from env:", !!process.env.BOT_TOKEN);
console.log("ALCHEMY_API_KEY from env:", !!process.env.ALCHEMY_API_KEY);
console.log("All env vars:", Object.keys(process.env));

if (
  !BOT_TOKEN ||
  BOT_TOKEN === "8560901651:AAGkgC4XqUhQ3O3MM0q_n3yKO8locxLQcZw"
) {
  console.log("⚠️ Using hardcoded token - env vars not working");
}

const { Telegraf } = require("telegraf");

console.log("🚀 Starting bot with token length:", BOT_TOKEN.length);

try {
  const bot = new Telegraf(BOT_TOKEN);

  bot.start((ctx) => {
    ctx.reply("🎉 Portfolio Sentinel Bot is LIVE!\nDeployed on Railway 🚀");
  });

  bot.command("status", (ctx) => {
    const envStatus = process.env.BOT_TOKEN
      ? "✅ Env Vars Working"
      : "⚠️ Hardcoded Token";
    ctx.reply(
      `🟢 Bot Status: Operational\n🌐 ${envStatus}\n⏰ 24/7 on Railway`
    );
  });

  bot.command("test", (ctx) => {
    ctx.reply("✅ Bot is responding correctly!");
  });

  console.log("✅ Bot initialized, launching...");

  bot
    .launch()
    .then(() => {
      console.log("🎉 SUCCESS: Bot running on Railway!");
      console.log("🤖 Bot: @PortfolioSentinelBot");
    })
    .catch((error) => {
      console.error("❌ Bot launch failed:", error.message);
    });

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
} catch (error) {
  console.error("❌ Bot creation failed:", error.message);
}
