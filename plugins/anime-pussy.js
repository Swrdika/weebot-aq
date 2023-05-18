let fetch = require('node-fetch')
const pkg = require('whatsapp-web.js')
const { MessageMedia } = pkg
let handler = async (m, { conn, text }) => {
let res = await fetch('https://raw.githubusercontent.com/BerkahEsport/api-be/main/lib/anime/nsfw/pussy.json')
if (!res.ok) throw global.eror
let json = await res.json();
let url = json[Math.floor(Math.random() * json.length)]

const media = await MessageMedia.fromUrl(url)
await conn.sendMessage(m.from, media, {caption: '📸'})
}
handler.command = /^(pussy)$/i
handler.tags = ['anime'] 
handler.help = ['pussy']
module.exports = handler