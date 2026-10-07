const fs = require('fs');
const axios = require('axios');
const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');
const { delay } = require('@whiskeysockets/baileys');

// CONFIG FINALE - NE TOUCHE PLUS
const CHANNEL_LINK = "https://whatsapp.com/channel/0029Vb8cfQn8V0te5K0atc1s"
const LOGO_PATH = './public/logo.png'
const OWNER_TG = "https://t.me/Mr_king_kayseur"
const OWNER_NAME = "Mr King Kayseur • The Glitch Dev 💎"

const boxStar = (title, content) => {
return `╭━━━〔 ★ ${title} ★ 〕━━━╮
┃
${content.split('\n').map(l=>`┃ ✦ ${l}`).join('\n')}
┃
╰━━━〔 ★ by ${OWNER_NAME} ★ 〕━━━╯`
}

const menuStar = `
╭━━━〔 *★ PHENIX GLITCH V1 ★* 〕━━━╮
┃ ★彡 OWNER: ${OWNER_NAME}
┃ ★彡 TG: ${OWNER_TG}
┃ ★彡 CHANNEL: ${CHANNEL_LINK}
┃
┣━━━〔 🌟 CORE 〕━━━
┃ *✦ 🍓 ping • vitesse*
┃ *✦ 🔥 menu • menu étoilé*
┃ *✦ 👑 owner • KING*
┃ *✦ 📢 channel • chaîne*
┃ *✦ ✨ alive • en vie*
┃ *✦ ⏳ runtime • uptime*
┃ *✦ 📶 speed • test*
┃ *✦ 🆔 id • ton id*
┃
┣━━━〔 🛡️ *PROTECTION* 〕━━━
┃ *✦ ★ antilink on/off*
┃ *✦ ★ welcome on/off*
┃ *✦ ★ goodbye on/off*
┃ *✦ ★ antibad on/off*
┃ *✦ ★ antispam • anti flood*
┃ *✦ ★ antibot • anti bot*
┃ *✦ ★ antitag • anti tag*
┃ *✦ ★ antisticker*
┃
┣━━━〔 🎮 *DOWNLOAD* 〕━━━
┃ *✦ ★ play • musique yt*
┃ *✦ ★ ytmp3 • yt mp3*
┃ *✦ ★ ytmp4 • yt mp4*
┃ *✦ ★ tiktok • no watermark*
┃ *✦ ★ fb • facebook*
┃ *✦ ★ ig • instagram*
┃ *✦ ★ twitter • twitter*
┃ *✦ ★ mediafire • mf dl*
┃ *✦ ★ apk • apk dl*
┃ *✦ ★ pinterest*
┃ *✦ ★ spotify*
┃
┣━━━〔 *🛠️ TOOLS* 〕━━━
┃ *✦ ☆ sticker • photo→sticker*
┃ *✦ ☆ toimg • sticker→photo*
┃ *✦ ☆ tomp3 • video→audio*
┃ *✦ ☆ tts • texte→voix*
┃ *✦ ☆ attp • texte animé*
┃ *✦ ☆ fancy • écriture stylée*
┃ *✦ ☆ carbon • code→img*
┃ *✦ ☆ quoted • fake quote*
┃
┣━━━〔 *👥 GROUPE* 〕━━━
┃ *✦ ☆ tagall • tag tous*
┃ *✦ ☆ hidetag • tag caché*
┃ *✦ ☆ kick / add / kickall*
┃ *✦ ☆ promote / demote*
┃ *✦ ☆ mute / unmute*
┃ *✦ ☆ linkgc • lien gc*
┃ *✦ ☆ infogc • info gc*
┃ *✦ ☆ setnamegc / setdescgc*
┃
┣━━━〔 *😂 FUN* 〕━━━
┃ *✦ ★ roll • dé 🎲*
┃ *✦ ★ flip • pile/face 🪙*
┃ *✦ ★ ship • compat 🍓*
┃ *✦ ★ fact • fact 🧠*
┃ *✦ ★ joke • blague 🃏*
┃ *✦ ★ 8ball • boule magique*
┃ *✦ ★ truth / dare*
┃ *✦ ★ gaycheck / beautifulcheck*
┃ *✦ ★ kiss / hug / slap / kill*
┃
┣━━━〔 *🤖 BOT* 〕━━━
┃ *✦ ☆ restart • relance*
┃ *✦ ☆ broadcast*
┃ *✦ ☆ block / unblock*
┃ *✦ ☆ cleardb*
┃
╰━━━〔 *★ 150 CMDS • PHENIX NEVER DIE ★* 〕━━━╯
       *_★ by mr king Kayseur • the glitch dev ★_*
`;

module.exports = async (sock) => {
    let settings = { antilink: {}, welcome: {}, goodbye: {}, antibad: {} };
    if(fs.existsSync('./settings.json')) settings = JSON.parse(fs.readFileSync('./settings.json'));

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if(!m.message || m.key.fromMe) return;
        const from = m.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const textRaw = (m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || "").trim();
        const text = textRaw.toLowerCase();
        const args = textRaw.split(' ');
        const cmd = args[0].toLowerCase().replace(/^[.\/!🍓🔥👑📢]/,'').trim();
        const q = args.slice(1).join(' ');
        const sender = m.key.participant || from;
        const replyStar = (t,c) => sock.sendMessage(from, { text: boxStar(t,c) }, { quoted: m });

        // ANTI-LINK ÉTOILÉ QUI SUPPRIME
        if(isGroup && settings.antilink[from] && /(https?:\/\/|chat\.whatsapp\.com|t\.me\/|wa\.me\/|whatsapp\.com\/channel)/i.test(textRaw)){
            try{
                const meta = await sock.groupMetadata(from);
                const isAdmin = meta.participants.find(p=>p.id==sender)?.admin;
                const isBotAdmin = meta.participants.find(p=>p.id==sock.user.id)?.admin;
                if(!isAdmin && isBotAdmin){
                    await sock.sendMessage(from, { delete: m.key });
                    await sock.sendMessage(from, {
                        text: `╭━━━〔 ★ *ANTI-LINK* ★ 〕━━━╮
┃
┃ ★ 🚫 LIEN INTERDIT!
┃ ★ 👤 @${sender.split('@')[0]}
┃ ★ 🔗 Suppression auto
┃ ★ 🛡️ PHENIX GLITCH V1
┃
╰━━━〔 ★ *PROTECTED* ★ 〕━━━╯`,
                        mentions:[sender]
                    });
                }
            }catch{}
        }

        if(['ping','speed'].includes(cmd)){
            let s = Date.now();
            await delay(300);
            await sock.sendMessage(from, {
                image: { url: fs.existsSync(LOGO_PATH)? LOGO_PATH : 'https://i.imgur.com/8Km9tLL.png' },
                caption: boxStar('🍓 PING PHENIX', `⚡ Vitesse: ${Date.now()-s}ms\n🔥 Status: EN LIGNE ★\n👑 Dev: ${OWNER_NAME}\n📢 ${CHANNEL_LINK}`),
                footer: "PHENIX V4 STAR",
                buttons: [
                    { buttonId: 'channel', buttonText: { displayText: '📢 ★ Chaîne' }, type: 1 },
                    { buttonId: 'owner', buttonText: { displayText: '👑 ★ Telegram' }, type: 1 }
                ],
                headerType: 4
            }, { quoted: m });
        }

        if(['menu','help','allmenu'].includes(cmd)){
            await sock.sendMessage(from, { text: menuStar }, { quoted: m });
        }
        if(['owner','king'].includes(cmd)) replyStar('👑 OWNER', `Nom: ${OWNER_NAME}\n★ Telegram: ${OWNER_TG}\n★ Channel: ${CHANNEL_LINK}\n★ Sécurité: Num caché TG only`);
        if(['channel','chaine'].includes(cmd)) replyStar('📢 CHANNEL', `${CHANNEL_LINK}\n\n★ Abonne-toi pour les MAJ V2`);

        if(cmd==='antilink' && isGroup){
            if(q==='on'){ settings.antilink[from]=true; replyStar('🛡️ ANTI-LINK','★ ACTIVÉ ★\nTous les liens seront supprimés avec message étoilé'); }
            else { delete settings.antilink[from]; replyStar('🛡️ ANTI-LINK','★ DÉSACTIVÉ'); }
            fs.writeFileSync('./settings.json', JSON.stringify(settings));
        }
        if(cmd==='welcome'){ if(q==='on'){ settings.welcome[from]=true; replyStar('👋 WELCOME','★ ON'); } else { delete settings.welcome[from]; replyStar('👋 WELCOME','★ OFF'); } fs.writeFileSync('./settings.json', JSON.stringify(settings)); }

        // PLAY REAL
        if(['play','song','ytmp3'].includes(cmd)){
            if(!q) return replyStar('▶️ PLAY','★ Usage:.play <nom>\nEx:.play afro beat');
            try{
                await sock.sendMessage(from, { text: boxStar('▶️ PLAY', `★ Recherche: ${q}\n★ Attends KING...`) }, { quoted: m });
                const search = await yts(q);
                const video = search.videos[0];
                const info = await ytdl.getInfo(video.url);
                const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
                await sock.sendMessage(from, { image: { url: video.thumbnail }, caption: boxStar('🎵 YT', `★ Titre: ${video.title}\n★ Durée: ${video.timestamp}\n★ Vues: ${video.views}`) }, { quoted: m });
                const audioBuffer = await axios.get(audioFormat.url, { responseType: 'arraybuffer' }).then(r=>r.data);
                await sock.sendMessage(from, { audio: Buffer.from(audioBuffer), mimetype: 'audio/mpeg', fileName: `${video.title}.mp3` }, { quoted: m });
            }catch(e){ replyStar('❌ ERREUR', e.message); }
        }

        if(['ytmp4','video'].includes(cmd)){
            if(!q) return replyStar('🎬 YTMP4','.ytmp4 <nom ou lien>');
            try{
                let url = q;
                if(!ytdl.validateURL(q)){ const s = await yts(q); url = s.videos[0].url; }
                const info = await ytdl.getInfo(url);
                const format = ytdl.chooseFormat(info.formats, { quality: '18' });
                await sock.sendMessage(from, { video: { url: format.url }, caption: boxStar('🎬 YTMP4', `★ ${info.videoDetails.title}`) }, { quoted: m });
            }catch(e){ replyStar('❌', e.message); }
        }

        if(['tiktok','tt'].includes(cmd)){
            if(!q) return replyStar('🎵 TIKTOK','.tiktok <lien>');
            try{
                const res = await axios.get(`https://www.tikwm.com/api/?url=${q}`).then(r=>r.data);
                await sock.sendMessage(from, { video: { url: res.data.play }, caption: boxStar('🎵 TIKTOK', `★ Auteur: ${res.data.author.nickname}\n★ ${res.data.title}`) }, { quoted: m });
            }catch{ replyStar('❌ TIKTOK','Lien invalide'); }
        }

        if(cmd==='sticker'){
            if(m.message.imageMessage || m.message.videoMessage){
                let buf = await sock.downloadMediaMessage(m);
                await sock.sendMessage(from, { sticker: buf }, { quoted: m });
            } else replyStar('🎨 STICKER','★ Envoie image +.sticker');
        }

        if(cmd==='tagall' && isGroup){
            const meta = await sock.groupMetadata(from);
            let txt = boxStar('📌 TAGALL', q||'Attention tous ★') + "\n";
            let men = [];
            meta.participants.forEach(p=>{ txt+=`@${p.id.split('@')[0]} `; men.push(p.id); });
            await sock.sendMessage(from, { text: txt, mentions: men });
        }

        if(cmd==='roll') replyStar('🎲 ROLL', `★ Dé: ${Math.floor(Math.random()*6)+1}`);
        if(cmd==='ship'){ let p=Math.floor(Math.random()*100); replyStar('❤️ SHIP', `★ Compat: ${p}%\n${p>70?'★ Âmes sœurs 🔥':'★ Courage 💔'}`); }

        if(m.message?.buttonsResponseMessage){
            let id=m.message.buttonsResponseMessage.buttonId;
            if(id==='channel') await sock.sendMessage(from, { text: boxStar('📢 CHANNEL', CHANNEL_LINK) });
            if(id==='owner') await sock.sendMessage(from, { text: boxStar('👑 TELEGRAM', OWNER_TG) });
        }
    });

    sock.ev.on('group-participants.update', async (anu)=>{
        if(anu.action==='add' && settings.welcome[anu.id]){
            for(let u of anu.participants){
                await sock.sendMessage(anu.id, {
                    image: { url: LOGO_PATH },
                    caption: boxStar('👋 WELCOME', `★ Bienvenue @${u.split('@')[0]}\n★ Dans PHENIX GLITCH\n★ Owner: ${OWNER_TG}`),
                    mentions:[u]
                });
            }
        }
    });
}