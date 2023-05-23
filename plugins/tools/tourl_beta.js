const uploadFile = require('../lib/uploadFile.js');
const uploadImage = require('../lib/uploadImage.js');

let handler = async (m) => {
  let q = m.hasQuotedm ? await m.getQuotedMessage() : m
  //const mime = (q.msg || q).mimetype || ''
 // if (!mime) throw new Error('No media found')
  if (!m.hasQuotedm) throw m.reply("No Medua Found")
  var isMedia = q.hasMedia && q.type.includes('image') || q.hasMedia && q.type.includes('video') || q.hasMedia && q.type.includes('gif');
  const media = await q.downloadMedia();
 // const isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
  const link = await (isMedia ? uploadImage : uploadFile)(media)
  m.reply(`📮 *L I N K :*
${link}
📊 *S I Z E :* ${media.length} Byte
📛 *E x p i r e d :* ${isMedia ? 'No Expiry Date' : 'Unknown'}`)
}

handler.help = ['upload (reply media)', 'tourl (reply media)']
handler.tags = ['tools']
handler.command = /^(tourl|upload)$/i

module.exports = handler
