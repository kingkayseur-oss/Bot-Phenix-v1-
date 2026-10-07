const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

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
        browser: ["Phenix Glitch V4 STAR", "Chrome", "1.0"]
    });

    sock.ev.on('creds.update', saveCreds);

    // Charge ton bot V4 STAR
    try {
        require('./bot')(sock);
        console.log("★ BOT V1 STAR CHARGÉ ★");
    } catch(e) {
        console.log("Erreur bot.js:", e.message);
    }

    // Si numéro fourni, demande pairing code
    if(number && !sock.authState.creds.registered){
        await delay(3000);
        try {
            lastCode = await sock.requestPairingCode(number);
            console.log(`╭━━━〔 ★ CODE PHENIX ★ 〕━━━╮\n┃ ★ CODE: ${lastCode}\n╰━━━━━━━━━━━━━━━━━━━━╯`);
        } catch(e) {
            console.log("Erreur pairing:", e.message);
        }
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if(connection === 'close'){
            console.log("Connexion fermée, reconnexion...");
            startBot();
        } else if(connection === 'open'){
            console.log("★ PHENIX V1  CONNECTÉ ★");
            lastCode = null; // reset code après connexion
        }
    });
}

// Route pour générer code pairing
app.post('/generate', async (req, res) => {
    let { number } = req.body;
    if(!number) return res.json({error: "Numéro vide"});
    
    number = number.replace(/[^0-9]/g, '');
    if(number.length < 10) return res.json({error: "Numéro invalide ★ mets avec indicatif ex: 2420650..."});

    lastCode = null; // reset
    console.log(`★ Demande code pour: ${number}`);

    try {
        await startBot(number);
        
        // Attend le code avec timeout
        let attempts = 0;
        while(!lastCode && attempts < 15){
            await delay(1000);
            attempts++;
        }
        
        if(lastCode){
            res.json({ code: lastCode, success: true });
        } else {
            res.json({ error: "Impossible de générer le code, réessaie ★" });
        }
    } catch(e){
        res.json({ error: e.message });
    }
});

app.get('/', (req,res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/status', (req,res) => res.json({ status: "PHENIX V1 ONLINE ★", code: lastCode }));

const PORT = process.env.PORT || 10000; // Render utilise 10000
app.listen(PORT, () => {
    console.log(`╭━━━〔 ★ PHENIX V1 const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

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
        browser: ["Phenix Glitch V1, "Chrome", "1.0"]
    });

    sock.ev.on('creds.update', saveCreds);

    // Charge ton bot V4 STAR
    try {
        require('./bot')(sock);
        console.log("★ BOT V1 CHARGÉ ★");
    } catch(e) {
        console.log("Erreur bot.js:", e.message);
    }

    // Si numéro fourni, demande pairing code
    if(number && !sock.authState.creds.registered){
        await delay(3000);
        try {
            lastCode = await sock.requestPairingCode(number);
            console.log(`╭━━━〔 ★ CODE PHENIX ★ 〕━━━╮\n┃ ★ CODE: ${lastCode}\n╰━━━━━━━━━━━━━━━━━━━━╯`);
        } catch(e) {
            console.log("Erreur pairing:", e.message);
        }
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if(connection === 'close'){
            console.log("Connexion fermée, reconnexion...");
            startBot();
        } else if(connection === 'open'){
            console.log("★ PHENIX V1 CONNECTÉ ★");
            lastCode = null; // reset code après connexion
        }
    });
}

// Route pour générer code pairing
app.post('/generate', async (req, res) => {
    let { number } = req.body;
    if(!number) return res.json({error: "Numéro vide"});
    
    number = number.replace(/[^0-9]/g, '');
    if(number.length < 10) return res.json({error: "Numéro invalide ★ mets avec indicatif ex: 2420650..."});

    lastCode = null; // reset
    console.log(`★ Demande code pour: ${number}`);

    try {
        await startBot(number);
        
        // Attend le code avec timeout
        let attempts = 0;
        while(!lastCode && attempts < 15){
            await delay(1000);
            attempts++;
        }
        
        if(lastCode){
            res.json({ code: lastCode, success: true });
        } else {
            res.json({ error: "Impossible de générer le code, réessaie ★" });
        }
    } catch(e){
        res.json({ error: e.message });
    }
});

app.get('/', (req,res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/status', (req,res) => res.json({ status: "PHENIX V1 ONLINE ★", code: lastCode }));

const PORT = process.env.PORT || 10000; // Render utilise 10000
app.listen(PORT, () => {
    console.log(`╭━━━〔 ★ PHENIX V1 ★ 〕━━━╮
┃ ★ Serveur en ligne sur ${PORT}
┃ ★ TG: https://t.me/Mr_king_kayseur
┃ ★ Prêt pour pairing
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`);
});

// Démarre sans numéro au début pour garder session
startBot(); ★ 〕━━━╮
┃ ★ Serveur en ligne sur ${PORT}
┃ ★ TG: https://t.me/Mr_king_kayseur
┃ ★ Prêt pour pairing
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`);
});

// Démarre sans numéro au début pour garder session
startBot();