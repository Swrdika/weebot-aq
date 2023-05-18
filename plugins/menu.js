let fs = require('fs')
let pkg = require('whatsapp-web.js')
let { MessageMedia } = pkg
let path = require('path')
let os = require('os')
const { platform } = os
let tags = {
  'main': 'MENU UTAMA',
  'anime': 'ANIME',
  'group': 'GROUP',
  'info': 'INFO',
  'tools': "PERALATAN",
  'owner': 'OWNER BOT',
  'advanced': 'LANJUTAN',
  '': 'LAIN = LAIN',

}
const defaultMenu = {
  before: `
S T A T S
⬡ Name : *%name*
⬡ Age : _soon_
⬡ Registered : _soon_

B O T  S T A T S
⬡ Name : *%me*
⬡ Uptime : *%uptime*
⬡ Jam : *%time*
⬡ Platform : *${os.platform}*
⬡ Tanggal : %week %date


`.trimStart(),
  header: '╭─「 *%category* 」',
  body: '│ • _%cmd_ %islimit %isPremium',
  footer: '╰────\n',
  after: `
`}
let handler = async (m, { conn, usedPrefix: _p, users }) => {
  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../../package.json')).catch(_ => '{}'))
    let name = users.pushname
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
              .replace(/%islimit/g, menu.limit ? '*(ʟɪᴍɪᴛ)*' : '')
              .replace(/%isPremium/g, menu.premium ? '*(ᴘʀᴇᴍɪᴜᴍ)*' : '')
              .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.info.pushname,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      name, weton, week, date, dateIslamic, time,
      readmore: readMore
    }
    let thumb = `https://telegra.ph/file/5b64b32b2105f07e3ee17.jpg`
    const media = await MessageMedia.fromUrl(thumb)
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    conn.sendMessage(m.from, media, {caption: text.trim()})
    //m.reply(text.trim())
  } catch (e) {
    m.reply('Maaf, menu sedang error')
    throw e
  }
}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
