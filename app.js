import TelegramBot from "node-telegram-bot-api";
import mediaDownloader from "./mediaApi.js"
import User from "./models/User.js"
import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express"
dotenv.config();

const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const adminChatId = process.env.ADMIN_CHAT_ID
const app = express()
app.get('/', (req, res) => {
  res.send('Bot starting...')
})
const PORT = 5500 | process.env.PORT
app.listen(PORT, () => {
  console.log("Server is running...")
})


// Botning start komandasi
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name;

  // Foydalanuvchi ma'lumotlarini olish
  const userData = {
    ID: msg.from.id,
    isBot: msg.from.is_bot,
    firstName: msg.from.first_name,
    userName: msg.from.username,
    status: "active",
  };

  try {
    // Foydalanuvchini bazadan qidirish
    const existingUser = await User.findOne({ ID: msg.from.id });

    if (existingUser) {
      // Foydalanuvchi allaqachon mavjud bo'lsa
      bot.sendMessage(
        chatId,
        `Assalomu Alaykum! 👋

Menga Instagram yoki Facebookdan havolani yuboring va men Sizga Videoni yuklab beraman!😇`
      );
    } else {
      // Foydalanuvchini bazaga saqlash
      const user = await User.create(userData);

      // Foydalanuvchiga Salom yo'llash
      bot.sendMessage(
        chatId,
        `Assalomu Alaykum! 👋

Menga Instagram yoki Facebookdan havolani yuboring va men Sizga Videoni yuklab beraman!😇`
      );

      // Adminga yangi foydalanuvchi haqida xabar yuborish
      if (adminChatId) {
        bot.sendMessage(
          adminChatId,
          `🔔 Yangi foydalanuvchi qo'shildi:\n\n👤 Ism: ${user.firstName}\n🆔 ID: ${user.ID}\n🌐 Username: @${user.userName || "Username mavjud emas"}`
        );
      }
    }
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
    bot.sendMessage(chatId, "Xatolik yuz berdi, iltimos keyinroq urinib ko'ring.");
  }
});

// Foydalanuvchi xabarini qayta ishlash
bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const URL = msg.text

  mediaDownloader(URL, bot, chatId)
})


// MongoDB ulanishi
mongoose.set("strictQuery", true);
mongoose

  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB ulanishda xatolik:", err));