const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');

const app = express();
app.use(express.static('public'));
app.use(express.json());

let sock;
let lastCode = null;

async function startBot(number) {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');
    
    sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ["Phenix V1", "Chrome", "1.0"]
    });

    sock.ev.on('creds.update', saveCreds);

    try {
        const botFunction = require('./bot');
        botFunction(sock);
        console.log("BOT CHARGE");
    } catch(e) {
        console.log("Erreur bot.js: " + e.message);
    }

    if(number && !sock.authState.creds.registered){
        await delay(3000);
        try {
            lastCode = await sock.requestPairingCode(number);
            console.log("CODE: " + lastCode);
        } catch(e) {
            console.log("Erreur pairing: " + e.message);
        }
    }

    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if(connection === 'close'){
            console.log("Connexion fermee, reconnexion...");
            startBot();
        } else if(connection === 'open'){
            console.log("PHENIX V1 CONNECTE");
            lastCode = null;
        }
    });
}

app.post('/generate', async (req, res) => {
    let { number } = req.body;
    if(!number) return res.json({error: "Numero vide"});
    
    number = number.replace(/[^0-9]/g, '');
    if(number.length < 10) return res.json({error: "Numero invalide"});

    lastCode = null;
    console.log("Demande code pour: " + number);

    try {
        await startBot(number);
        let attempts = 0;
        while(!lastCode && attempts < 15){
            await delay(1000);
            attempts++;
        }
        if(lastCode){
            res.json({ code: lastCode, success: true });
        } else {
            res.json({ error: "Impossible de generer le code" });
        }
    } catch(e){
        res.json({ error: e.message });
    }
});

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/status', (req,res) => {
    res.json({ status: "PHENIX V1 ONLINE", code: lastCode });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("Serveur en ligne sur port " + PORT);
});

startBot();
