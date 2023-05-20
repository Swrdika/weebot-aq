let handler = async (m, { conn, usedPrefix: _p, users }) => {

let author = `• whatsapp-web.js\n• @Swrdika\n• @Moexti\n• @Nurutomo\n• Skizo Api`
let gh = `wwebjs =\n> https://github.com/pedroslopez/whatsapp-web.js\n\n@Swrdika =\n> https://github.com/Swrdika\n\n@Moexti =\n> https://github.com/Moexti\n\nNurutomo =\n> https://github.com/Nurutomo\n\nSkizo Api =\n> https://xznsenpai.xyz`

conn.sendMessage(m.from, `*Shoutout To*\n\n${author}\n\n${gh}`, {
                    extra: {
                        ctwaContext: {
                            title: 'Shoutout To',
                            description: `Terimakasih untuk Developer & RestAPI`,
                            thumbnailUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
                            sourceUrl: 'https://github.com/Swrdika'
                        }
                    }
                   })   
}
handler.tags = ['main']
handler.help = ['thanksto', 'tqto']
handler.command = /^t(qto|hank(s)|to)$/i

module.exports = handler
