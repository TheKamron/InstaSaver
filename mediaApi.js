import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const mediaDownloader = async (URL, bot, chatId) => {

// Instagram Reels
if(URL.startsWith('https://www.instagram.com/reel/')) {
        bot.sendMessage(chatId, 'Yuklanmoqda...')

        const options = {
          method: 'GET',
          url: 'https://instagram-scraper-api-stories-reels-va-post.p.rapidapi.com/',
          params: {
            url: URL
          },
          headers: {
            'x-rapidapi-key': process.env.INSTAGRAM_API_KEY,
            'x-rapidapi-host': process.env.INSTAGRAM_API_HOST
          }
        };
        
        try {
          const response = await axios.request(options);
          const reelUrl = response.data.download_url  
          const videoCaption = response.data.caption
          const buttons = {
            reply_markup: {
              inline_keyboard: [
                [{text: "🎧Qo'shiqni yuklab olish.", callback_data: "download_song"}],
                [{text: "Guruhga Qo'shish⤴️", url: "https://t.me/local_instasaverbot?startgroup=true"}]
              ]
            }
          }
          if(reelUrl) {
            bot.sendVideo(chatId, reelUrl, {
              caption: `
              🚀<a href="https://t.me/local_instasaverbot"><b>@InstaSaverBot</b></a> 🖤 <b>orqali yuklandi!</b>
              
${videoCaption}`,
              parse_mode: "HTML",
              ...buttons
            })
            // bot.sendMessage(chatId, `${videoCaption} `)
          } else {
            bot.sendMessage(chatId, "Ushbu Video topilmadi. URL Havolani qayta tekshirib ko'ring!")
          }
        } catch (error) {
          console.error(error);
        }
}
    
// Instagram Stories

if(URL.startsWith('https://www.instagram.com/stories/')) {
        bot.sendMessage(chatId, 'Yuklanmoqda...')

        const options = {
          method: 'GET',
          url: 'https://instagram-scraper-api-stories-reels-va-post.p.rapidapi.com/',
          params: {
            url: URL
          },
          headers: {
            'x-rapidapi-key': process.env.INSTAGRAM_API_KEY,
            'x-rapidapi-host': process.env.INSTAGRAM_API_HOST
          }
        };
        
        try {
          const response = await axios.request(options);
          const storyUrl = response.data.medias[0].download_url
          const buttons = {
            reply_markup: {
              inline_keyboard: [
                [{text: "Guruhga Qo'shish⤴️", url: "https://t.me/local_instasaverbot?startgroup=true"}]
              ]
            }
          }
          if(storyUrl) {
            bot.sendVideo(chatId, storyUrl, {
              caption: `
              🚀<a href="https://t.me/local_instasaverbot"><b>@InstaSaverBot</b></a> 🖤 <b>orqali yuklandi!</b>`,
              parse_mode: "HTML",
              ...buttons
            })
          } else {
            bot.sendMessage(chatId, "Ushbu Video topilmadi. URL Havolani qayta tekshirib ko'ring!")
          }
        } catch (error) {
          console.error(error);
        }
}

// Facebook Video

if(URL.startsWith("https://www.facebook.com/share/")) {
  bot.sendMessage(chatId, 'Yuklanmoqda...')
const encodedParams = new URLSearchParams();
encodedParams.set('url', URL);

const options = {
  method: 'POST',
  url: 'https://all-media-downloader3.p.rapidapi.com/all',
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': process.env.RAPIDAPI_HOST,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data: encodedParams,
};

try {
	const response = await axios.request(options);
	const result = response.data.formats.map(format => format.url)
  const videoCaption = response.data.title
  const videoUrl = result[1]
  const buttons = {
            reply_markup: {
              inline_keyboard: [
                [{text: "Guruhga Qo'shish⤴️", url: "https://t.me/local_instasaverbot?startgroup=true"}]
              ]
            }
          }
  if(videoUrl) {
    bot.sendVideo(chatId, videoUrl, {
      caption: `
      🚀<a href="https://t.me/local_instasaverbot"><b>@InstaSaverBot</b></a> 🖤 <b>orqali yuklandi!</b>              

${videoCaption}`,
              parse_mode: "HTML",
              ...buttons
  })
  } else {
    bot.sendMessage(chatId, "Ushbu video topilmadi. URLni tekshirib ko'ring.");
  } 
} catch (error) {
  console.log(error)
}
}


}
export default mediaDownloader;
