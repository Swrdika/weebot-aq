/**
* Base Created by @moexti
* Added more feature by @Swrdika
*/
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


global.roles = {
  /*
  'Role Name': <Minimal Level To Obtain this Role>
  */
  'Beginner': 0,
  'Ametaur': 10,
  'Rookie': 20,
  'Novice': 30,
  'Intermediate': 40,
  'Copper': 50,
  'Silver': 60,
  'Gold': 80,
  'Diamond I': 90,
  'Diamond II': 100,
  'Diamond III': 115,
  'Emerald I': 125,
  'Emerlad II': 135,
  'Emerald III': 150,
  'Immortal I': 175,
  'Immortal II': 190,
  'Immortal III': 210,
  'Immortal IV': 250,
  'Master I': 290,
  'Master II': 340,
  'Master III': 370,
  'The Grandmaster': 500
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