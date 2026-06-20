import express from "express";
import fs from "fs";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const COUNTER_FILE = "./counter.txt";

// create file if not exist
if (!fs.existsSync(COUNTER_FILE)) {
  fs.writeFileSync(COUNTER_FILE, "0");
}

// send message to telegram
async function sendMessage(chatId, text) {
  try {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    });
  } catch (err) {
    console.error("Telegram send error:", err);
  }
}

// webhook
app.post("/webhook", async (req, res) => {
  try {
    const msg = req.body?.message;

    if (!msg || !msg.text) {
      return res.sendStatus(200);
    }

    const chatId = msg.chat.id;
    const text = msg.text.trim();

    if (text === "لیلی") {
      let count = parseInt(fs.readFileSync(COUNTER_FILE, "utf8") || "0");

      count++;

      fs.writeFileSync(COUNTER_FILE, count.toString());

      await sendMessage(chatId, `لیلی شماره: ${count}`);
    }

    res.sendStatus(200);

  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(200);
  }
});

// health check
app.get("/", (req, res) => {
  res.send("Bot is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Bot running on port", PORT);
});
