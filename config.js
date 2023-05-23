const moment = require('moment-timezone')

let wib = moment.tz('Asia/Jakarta').format('HH:mm')
let wita = moment.tz('Asia/Makassar').format('HH:mm')



global.ig = "https://" //Your Instagram
global.gc = "https://" // Whatsapp Group?
global.yt = "https://" //Your Youtube Channel
global.gh = "https://" //Your Github Profile

global.wm = `Cowboy - Bebot by @Swrdika\n\nTime: ${wib}`
global.owner = [
//  ["YourNumber", "Name", "Is it creator? ( true/false )]
    ["62812381421443", "Swrdika", true],
]

global.thumb = "https://" //Your thumb
global.sticker = {
  packname: "",
  author: `@Swrdika\nCreated At ${wib} WIB`
}

// Shoutout to @moexti
global.RestAPI = {
  lolhuman: { website: 'https://api.lolhuman.xyz/', apikey: 'sgwn'},
  xznsenpai: { website: 'http://xznsenpai.xyz/', apikey: ''}
}















// Watch File, Dont Delete it!
let file = require.resolve(__filename);
let fs = require('fs');
let chalk = require('chalk');
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright("Update 'config.js'"));
  delete require.cache[file];
  require(file);
})