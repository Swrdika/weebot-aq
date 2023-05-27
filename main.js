/**
* Base Created by @moexti
* Added more feature by @Swrdika
*/
const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const syntaxerror = require('syntax-error');
const _ = require('lodash');
const logger = require('pino')({
    transport: {
        target: "pino-pretty",
        options: {
            levelFirst: true,
            ignore: "hostname",
            translateTime: true,
        }}}).child({});


process.on("uncaughtException", console.error);


//Load Plugins
const pluginFolder = path.join(__dirname, "plugins");
const pluginFilter = fs
  .readdirSync(pluginFolder, { withFileTypes: true })
  .filter((v) => v.isDirectory());
const pluginFile = (filename) => /\.js$/.test(filename);

pluginFilter.map(async ({ name }) => {
  global.plugins = {};
  let files = await fs.readdirSync(path.join(pluginFolder, name));
  for (let filename of files) {
    try {
      global.plugins[filename] = require(path.join(
        pluginFolder,
        name,
        filename
      ));
      fs.watch(pluginFolder + "/" + name, global.reload);
    } catch (e) {
      logger.error(e);
      delete global.plugins[filename];
    }
  }
});
logger.info("Berhasil memuat semua plugins.");

global.reload = async (_event, filename) => {
  if (pluginFile(filename)) {
    let subdirs = await fs.readdirSync(pluginFolder);
    subdirs.forEach((files) => {
      let dir = path.join(pluginFolder, files, filename);
      if (fs.existsSync(dir)) {
        if (dir in require.cache) {
          delete require.cache[dir];
          if (fs.existsSync(dir))
            logger.info(`- Perubahan plugin '${filename}'`);
          else {
            logger.warn(`- Menghapus plugin '${filename}'`);
            return delete global.plugins[filename];
          }
        } else logger.info(`- Menambah plugin '${filename}'`);
        let err = syntaxerror(fs.readFileSync(dir), filename);
        if (err)
          logger.error(`Sintax error ketika dimuat '${filename}'\n${err}`);
        else
          try {
            global.plugins[filename] = require(dir);
          } catch (e) {
            logger.error(e);
          } finally {
            global.plugins = Object.fromEntries(
              Object.entries(global.plugins).sort(([a], [b]) =>
                a.localeCompare(b)
              )
            );
          }
      }
    });
  }
};
Object.freeze(global.reload);


global.prefix = new RegExp("^[" + "‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-".replace(/[|\\{}()[\]^$+*?.\-\^]/g, "\\$&") + "]");


/** @type {(name: string, path: string, query: { [Key: string]: any }, apikeyqueryname: string) => string} */
global.API = (name, path = "/", query = {}, apikeyqueryname) =>
  (name in global.RestAPI ? global.RestAPI[name].website : name)
  + path + 
  (query === `apikey`  ? `?apikey=${global.RestAPI[name].apikey}&${apikeyqueryname}` : 
  (query || apikeyqueryname ? "?" + new URLSearchParams(Object.entries( 
  {...query, ...(apikeyqueryname ? { [apikeyqueryname]: 
  (name in global.RestAPI ? global.RestAPI[name].apikey : name)
  } : {})})) : '' ))



var low
try {
  low = require('lowdb');
} catch {
  low = require('./lib/lowdb');
}
const { Low, JSONFile } = low
global.db = new Low(
  new JSONFile('database.json')
)

async function ClientConnect() {
    global.conn = new Client({
        authStrategy: new LocalAuth({
        clientId: 'cowboy-bebot',
        dataPath: './session' // nama folder session bebas dikasih nama apa aja
        }),
        puppeteer: {
            args: ["--no-sandbox", "--disable-gpu"],
            executablePath: '/usr/bin/google-chrome-stable'// khusus vps | kalo kamu pengguna rdp bisa ganti jadj path chrome mu
        }
    });


    conn.on('loading_screen', (percent) => {
    logger.info(`Wait... ${percemt}`)
    });


    conn.on('qr', qr => {
        QRCode.generate(qr, { small: true });
        logger.info("Scan QR Code di atas agar terhubung ke WaWeb...");
    });


    conn.on('authenticated', () => {
      logger.info("Connecting...");
  });
    

    conn.on('auth_failure', msg => {
    logger.error(msg)
    ClientConnect()
    loadDatabase()
  });


    conn.on('ready', async () => {
        if (global.db.data == null) await loadDatabase();
        logger.info("Connected ✅"); // Code dibawah buat info bot ini berjalan sukses...
        await conn.sendMessage(owner, `${JSON.stringify(conn.info)}`)
    });


    conn.on('message', require('./handler').handler.bind(conn));


    conn.initialize();

    return conn;

}

/**
Database Bot
*/
loadDatabase()
async function loadDatabase() {
  await global.db.read()
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    settings: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}


setInterval(async () =>{
  if (global.db) await global.db.write();
}, 30 * 1000)

ClientConnect()
.catch(e => console.error(e))
