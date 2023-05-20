let handler = async (m, { text, users }) => {
    let mama = users.pushname
    let user = global.db.data.users[m.from]
    user.afk = + new Date
    user.afkReason = text
    let pesan = `${mama} is now AFK\n\nAlasan : ${text ? '' + text : 'Tanpa Alasan'}`    

m.reply(pesan)
}
handler.help = ['afk [reason]']
handler.tags = ['main']
handler.command = /^afk$/i

module.exports = handler
