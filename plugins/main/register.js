const { createHash } = require('crypto')
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { text, usedPrefix }) {
  let user = global.db.data.users[m.from]
  if (user.registered === true) throw m.reply(`Kamu Sudah Terdaftar!`)
  if (!Reg.test(text)) throw m.reply(`Format salah\n*${usedPrefix}daftar nama.umur*`)
  let [_, name, splitter, age] = text.match(Reg)
  if (!name) throw m.reply('Nama tidak boleh kosong (Alphanumeric)')
  if (!age) throw m.reply('Umur tidak boleh kosong (Angka)')
  age = parseInt(age)
  if (age > 120) throw m.reply('Umur terlalu tua 😂')
  if (age < 5) throw m.reply('Bayi bisa ngetik sesuai format bjir ._.')
  user.name = name.trim()
  user.age = age
  user.regTime = + new Date
  user.registered = true

  m.reply(`
Daftar berhasil!

╭─「 Info 」
│ Nama: ${name}
│ Umur: ${age} tahun
╰────
`.trim())
}
handler.help = ['daftar', 'reg', 'register'].map(v => v + ' <nama>.<umur>')
handler.tags = ['exp']

handler.command = /^(daftar|reg(ister)?)$/i

module.exports = handler

