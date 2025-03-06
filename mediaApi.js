import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const mediaDownloader = async (URL, bot, chatId) => {
  // URL 
  if (!URL || !URL.startsWith("http")) {
    return; 
  }

  bot.sendMessage(chatId, "Yuklanmoqda...");

  try {
    // Instagram Reels
    if (URL.startsWith("https://www.instagram.com/reel/")) {
      const options = {
        method: "GET",
        url: "https://instagram-scraper-api-stories-reels-va-post.p.rapidapi.com/",
        params: { url: URL },
        headers: {
          "x-rapidapi-key": process.env.INSTAGRAM_API_KEY,
          "x-rapidapi-host": process.env.INSTAGRAM_API_HOST,
        },
      };

      const response = await axios.request(options);
      if (!response.data || !response.data.download_url) {
        throw new Error("Video topilmadi yoki API javobi xato.");
      }

      const reelUrl = response.data.download_url;
      const videoCaption = response.data.caption || "Qo‘shimcha ma'lumot yo‘q.";

      const buttons = {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🎧 Qo'shiqni yuklab olish.", callback_data: "download_song" }],
            [{ text: "Guruhga Qo'shish⤴️", url: "https://t.me/local_instasaverbot?startgroup=true" }],
          ],
        },
      };

      bot.sendVideo(chatId, reelUrl, {
        caption: `🚀 <a href="https://t.me/local_instasaverbot"><b>@InstaSaverBot</b></a> 🖤 orqali yuklandi!\n\n${videoCaption}`,
        parse_mode: "HTML",
        ...buttons,
      });
    }

    // Instagram Stories
    else if (URL.startsWith("https://www.instagram.com/stories/")) {
      const options = {
        method: "GET",
        url: "https://instagram-scraper-api-stories-reels-va-post.p.rapidapi.com/",
        params: { url: URL },
        headers: {
          "x-rapidapi-key": process.env.INSTAGRAM_API_KEY,
          "x-rapidapi-host": process.env.INSTAGRAM_API_HOST,
        },
      };

      const response = await axios.request(options);
      if (!response.data || !response.data.medias || !response.data.medias[0].download_url) {
        throw new Error("Afsuski, Storis topilmadi yoki API javobi xato.");
      }

      const storyUrl = response.data.medias[0].download_url;

      const buttons = {
        reply_markup: {
          inline_keyboard: [[{ text: "Guruhga Qo'shish⤴️", url: "https://t.me/local_instasaverbot?startgroup=true" }]],
        },
      };

      bot.sendVideo(chatId, storyUrl, {
        caption: `🚀 <a href="https://t.me/local_instasaverbot"><b>@InstaSaverBot</b></a> 🖤 orqali yuklandi!`,
        parse_mode: "HTML",
        ...buttons,
      });
    }

    // Facebook Video
    else if (URL.startsWith("https://www.facebook.com/share/")) {
      const encodedParams = new URLSearchParams();
      encodedParams.set("url", URL);

      const options = {
        method: "POST",
        url: "https://all-media-downloader3.p.rapidapi.com/all",
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": process.env.RAPIDAPI_HOST,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: encodedParams,
      };

      const response = await axios.request(options);
      if (!response.data || !response.data.formats || response.data.formats.length === 0) {
        throw new Error("Facebook videosi topilmadi yoki API noto‘g‘ri javob qaytardi.");
      }

      const videoUrl = response.data.formats[1]?.url;
      const videoCaption = response.data.title || "Qo‘shimcha ma'lumot yo‘q.";

      const buttons = {
        reply_markup: {
          inline_keyboard: [[{ text: "Guruhga Qo'shish⤴️", url: "https://t.me/local_instasaverbot?startgroup=true" }]],
        },
      };

      bot.sendVideo(chatId, videoUrl, {
        caption: `🚀 <a href="https://t.me/local_instasaverbot"><b>@InstaSaverBot</b></a> 🖤 orqali yuklandi!\n\n${videoCaption}`,
        parse_mode: "HTML",
        ...buttons,
      });
    } else {
      bot.sendMessage(chatId, "Noto‘g‘ri URL! Iltimos, Instagram yoki Facebook havolasini yuboring.");
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `Xatolik yuz berdi: ${error.message || "Noma'lum xatolik"}`);
  }
};

export default mediaDownloader;
