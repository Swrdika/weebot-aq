const axios = require("axios");

let handler = async (m, { text, usedPrefix, command }) => {
    if(!text) return m.reply(`Masukkan teks yang mau ditanyakan ke OpenAI \nContoh: ${usedPrefix+command} Apa itu chat GPT?`)
    m.reply("Tunggu Sebentar...")
  const response = await axios.get(
    `https://sh.xznsenpai.xyz/api/openai?text=${text}&apikey=Rippanteq`,
    {
      responseType: "json",
    }
  );
  const v = response.data;
  m.reply(v.result);
};
handler.help = ["ai"];
handler.tags = ["tools"];
handler.command = /^(ai)$/i;
handler.register = true;
module.exports = handler;

// Dari requestan => https://github.com/ahlulmukh
// Dan di perbaiki sedikit ^_^
