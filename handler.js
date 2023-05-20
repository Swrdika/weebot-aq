require('./config.js');
let fs = require('fs')
let { format } = require('util')
const chalk = require('chalk');
const pkg = require('whatsapp-web.js');
const { MessageMedia } = pkg

const { toAudio, toPTT, toVideo } = require('./lib/konversi.js')
var isNumber = x => typeof x === 'number' && !isNaN(x);
module.exports = {
    async handler(m) {
        //if (!m) return;
        let chats = await m.getChat();
        let users = await m.getContact();
        try {

            //  <----- Fungsi Database -----> Tambahin sendiri jika perlu.
            try {
                let user = global.db.data.users[m.author || m.from]
                if (typeof user !== 'object') global.db.data.users[m.author || m.from] = {}
                if (user) {                    
                    if (!user.registered) {
                        if (!('name' in user)) user.name = users.pushname
                        if (!isNumber(user.age)) user.age = -1;
                        if (!isNumber(user.regTime)) user.regTime = -1;
                        if (!("premium" in user)) user.premium = false;
                  }
                    if (!"banned" in user) user.banned = false;
                    if (!"mute" in user) user.mute = false;
                    if (!"afkReason" in user) user.afkReason = "";
                    if (!("registered" in user)) user.registered = false;
                    if (!isNumber(user.healt)) user.healt = 0;
                    if (!isNumber(user.stamina)) user.stamina = 100;
                    if (!isNumber(user.level)) user.level = 0;
                    if (!isNumber(user.exp)) user.exp = 0;
                    if (!isNumber(user.limit)) user.limit = 10;
                    if (!isNumber(user.lastclaim)) user.lastclaim = 0;
                    if (!isNumber(user.money)) user.money = 0;
                    if (!isNumber(user.premiumTime)) user.premiumTime = 0;
                    if (!isNumber(user.warn)) user.warn = 0;
                    if (!isNumber(user.afk)) user.afk = -1;
                } else global.db.data.users[m.author || m.from] = {
                    name: users.pushname,
                    afk: -1,
                    age: -1,
                    regTime: -1,
                    premium: false,
                    banned: false,
                    mute: false,
                    afkReason: "",
                    registered: false,
                    healt: 100,
                    stamina: 100,
                    level: 0,
                    exp: 0,
                    limit: 10,
                    lastclaim: 0,
                    money: 0,
                    premiumTime: 0,
                    warn: 0
                }
                
               let chat = global.db.data.chats[m.chat]
        if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}
        if (chat) {
          if (!('isBanned' in chat)) chat.isBanned = false
          if (!('antiLink' in chat)) chat.antiLink = false
          if (!('antiSticker' in chat)) chat.antiSticker = false
        } else global.db.data.chats[m.chat] = {
          isBanned: false,
          antiLink: false,
          antiSticker: false,
        }
            } catch (e) {
                console.log("DATABASE RUSAK", e)
            }

            // Untuk akses plugins kamu
            let isGroup = m.from.endsWith("@g.us");
            let isROwner = [this.info.me.user, ...global.owner.map(([number]) => number)].map((v) => v?.replace(/[^0-9]/g, "") ).includes((isGroup ? m.author : m.from).split("@")[0]);
            let isOwner = isROwner || m.fromMe;
            let participants = isGroup ? (await m.getChat()).participants  : [];
            let AdminFilter = isGroup ? participants.filter(v => v.isAdmin).map(v => v.id.user) : '';
            let isAdmin = isGroup ? AdminFilter.map(v => v.replace(/[^0-9]/g, '') + '@c.us').includes(m.author ? m.author : m.from) : '';
            let isBotAdmin = isGroup ? AdminFilter.map(v => v.replace(/[^0-9]/g, '') + '@c.us').includes(conn.info.me._serialized) : '';
            const isPrems = isROwner || global.db.data.users[m.author || m.from].premium == true
            // Untuk menjalankan plugin prefix dan cmd kamu
            let usedPrefix;
            for (let name in global.plugins) {
              let plugin = global.plugins[name];
              if (!plugin) continue;
              const str2Regex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
              let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix;
              let match = (
                _prefix instanceof RegExp // RegExp Mode?
                    ? [[_prefix.exec(m.body), _prefix]]
                    : Array.isArray(_prefix) // Array?
                    ? _prefix.map((p) => {
                        let re =
                        p instanceof RegExp // RegExp in Array?
                          ? p
                          : new RegExp(str2Regex(p));
                        return [re.exec(m.body), re];
                    })
                    : typeof _prefix === "string" // String?
                    ? [
                      [
                        new RegExp(str2Regex(_prefix)).exec(m.body),
                        new RegExp(str2Regex(_prefix)),
                      ],
                    ]
                    : [[[], new RegExp()]]
                ).find((p) => p[1]);
                if (typeof plugin.before === 'function') {
                    if (await plugin.before.call(this, m, {
                        match,
                        conn: this,
                        participants,
                        isROwner,
                        isOwner,
                        isAdmin,
                        isBotAdmin,
                        isPrems,
                        m,
                        __dirname: ___dirname,
                        __filename
                    }))
                        continue
                }
                if (typeof plugin !== 'function') continue

                if ((usedPrefix = (match[0] || "")[0])) {
                let noPrefix = m.body.replace(usedPrefix, "");
                let [command, ...args] = noPrefix.trim().split` `.filter((v) => v);
                args = args || [];
                let _args = noPrefix.trim().split` `.slice(1);
                let text = _args.join` `;
                command = (command || "").toLowerCase();
                let fail = plugin.fail || global.dfail // <----- Jika ditolak ----->
                let isAccept =
                    plugin.command instanceof RegExp // <----- RegExp Mode tidak memakai Prefix ----->
                    ? plugin.command.test(command)
                    : Array.isArray(plugin.command) // <----- Array ----->
                    ? plugin.command.some((cmd) =>
                        cmd instanceof RegExp // <----- RegExp dalam Array ----->
                            ? cmd.test(command)
                            : cmd === command
                        )
                    : typeof plugin.command === "string" // String?
                    ? plugin.command === command
                    : false;
        
                if (!isAccept) continue;
                m.plugin = name;

                // // <----- Fungsi untuk pengecualian akses plugin Command ----->
                if (plugin.rowner && !isROwner) {
                    fail('rowner', m, conn)
                    continue;
                }
                if (plugin.owner && !isOwner) {
                    fail('owner', m, conn)
                    continue;
                }
                if (plugin.premium && !isPrems) {
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !isGroup) {
                    fail("group", m, conn);
                    continue;
                  } 
                else if (plugin.admin && !isAdmin) {
                    fail('admin', m, conn)
                    continue;
                  } 
                else if (plugin.botAdmin && !isBotAdmin) {
                    fail('botAdmin', m, conn)
                    continue;
                }
                if (plugin.private && isGroup) {
                    fail('private', m, conn)
                    continue;
                }
                if (plugin.register == true && _user.registered == false) { // Butuh daftar?
                    fail('unreg', m, this)
                    continue
                }
      
                m.isCommand = true;
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 3 // <----- EXP yang didapat per Command ----->
                if (xp > 200)
                    m.reply('ɴɢᴇᴄɪᴛ -_-') // // <----- Jika EXP didapat melebihi 200 ----->
                else
                    m.exp += xp
                if (!isPrems && plugin.limit && global.db.data.users[m.author || m.from].limit < plugin.limit * 1) {
                    this.reply(m.chat, `[❗] ʟɪᴍɪᴛ ᴀɴᴅᴀ ʜᴀʙɪꜱ, ꜱɪʟᴀʜᴋᴀɴ ʙᴇʟɪ ᴍᴇʟᴀʟᴜɪ *${usedPrefix}buy limit*.`, m)
                    continue; }// // <----- Jika limit habis ----->
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    m,
                    users,
                    isGroup,
                    isAdmin,
                    isPrems
                };
                try {
                    await plugin.call(this, m, extra);
                    if (!isPrems) m.limit = m.limit || plugin.limit || false
                } catch (e) { 
                    m.error = e
                   console.error(e)
                    if (e) {  // Jika terjadi error Kode
                        let text = format(e)
                        for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                        m.reply(`Fitur ERROR, laporkan Pemilik BOT. \n*🗂️ Plugin:* ${m.plugin}\n*👤 Pengirim:* ${(isGroup ? m.author : m.from).replace('@c.us','')}\n*💬 Chat Owner:* https://wa.me/${jid}\n*💻 Command:* ${usedPrefix}${command} ${args.join(' ')}\n📄 *Error Logs:*\n\n\`\`\`${text}\`\`\``.trim())
                        }
                    }
                } finally {
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if (m.limit)
                        m.reply(+m.limit + " ʟɪᴍɪᴛ ᴛᴇʀᴘᴀᴋᴀɪ ✔️");
                }
                break
            }
            }
        } catch (e) {
            console.error(e)
        } finally {
            let user, stats = global.db.data.stats
            if (m) {
                if (users.number && (user = global.db.data.users[m.author || m.from])) {
                    user.exp += m.exp
                    user.limit -= m.limit * 1
                }
    
                
                if (m.plugin) {
                        if (!isNumber(stats.total))
                            stats.total = 0
                        if (!isNumber(stats.success))
                            stats.success = 0
                        if (!isNumber(stats.failed))
                            stats.failed = 0
                    } else {
                        stats = {
                            total: 0,
                            success: 0,
                            failed: 0
                        }
                    }
                    stats.total += 1
                    if (m.error == null) {
                        stats.success += 1
                    } else {
                        stats.failed += 1
                    }
                
            }
            // Hasil dilihat pada console.log
            require("./lib/print")(this, m).catch((e) => console.log(e));
        }
    }
}


global.dfail = (type, m, conn) => {
    let userrs = global.db.data.users[m.from]
    let userss = userrs.name
    let nmsr = `👋 Hai *@${userss}*,\n`
    let msg = {
    rowner: `${nmsr}\n🤵‍♂️ Mohon maaf, perintah ini hanya dapat digunakan oleh *OWNER* bot!`,
    owner: `${nmsr}\n👑 Maaf ya, perintah ini hanya untuk *Owner Bot*!`,
    mods: `${nmsr}\n🕵️‍♂️ Mohon maaf, hanya *Moderator* yang bisa menggunakan perintah ini!`,
    premium: `${nmsr}\n💰 Hanya member *Premium* yang bisa menggunakan perintah ini!\n\nbeli prem dengan ketik .premium`,
    group: `${nmsr}\n👥 Maaf, perintah ini hanya dapat digunakan di dalam grup!`,
    private: `${nmsr}\n💬 Perintah ini hanya dapat digunakan di Chat Pribadi!`,
    admin: `${nmsr}\n👮‍♂️ Mohon maaf, perintah ini hanya untuk *Admin* grup!`,
    botAdmin: `${nmsr}\n🤖 Jadikan bot sebagai *Admin* untuk menggunakan perintah ini!`,
    nsfw: `${nmsr}\n🔞 Mohon maaf, fitur NSFW tidak aktif saat ini. Silahkan hubungi Team Bot Discussion untuk mengaktifkan fitur ini!`,
    rpg: `${nmsr}\n🎮 Maaf, fitur RPG tidak aktif saat ini. Silahkan hubungi Team Bot Discussion Untuk mengaktifkan fitur ini!`,
    restrict: `${nmsr}\n❌ Maaf, fitur ini sedang di *disable*!`,
    unreg: `${nmsr}\n📁 Maaf, anda harus registrasi terlebih dahulu\nGunakan command /daftar untuk mendaftar`
}[type]
if (msg) return conn.sendMessage(m.from, msg, {
                                               extra:{
                                                   ctwaContext: {
                                                          title: `ACCESS DENIED`,
                                                          description: `${nmsr}`,
                                                          thumbnailUrl: `https://telegra.ph/file/23db68e05080f4e4cb216.jpg`,
                                                          sourceUrl: `https://github.com/Swrdika`,
                                                      }
                                                  }
                                                  })
  }
  // <----- BERKAHESPORT.ID OFC ----->>
/* Whatsapp bot versi WAWEB ini mohon digunakan dengan bijak
Terimakasih Untuk ALLAH S.W.T.
Serta junjungan kami nabi Muhammad S.A.W

Base created by @moexti 08 Mei 2023
- Silahkan tambah disini bro...
-
-

Jangan ubah yak mending ditambah... ^_^
*/