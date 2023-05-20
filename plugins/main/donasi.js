let handler = async m => m.reply(`
╭─「 Donasi • Pulsa 」
│ • Telkomsel [081238142144]
╰────

╭─「 Donasi • Non Pulsa 」
│ • Dana      : 081238142144
│ • OVO       : 081238142144
│ • Shoppepay : 081238142144
│ • Gopay     : 081238142144
╰────
`.trim()) // Tambah sendiri kalo mau
handler.help = ['donasi']
handler.tags = ['main']
handler.command = /^dona(te|si)$/i

module.exports = handler