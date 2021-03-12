const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const axios = require('axios')
const moment = require('moment-timezone')
const get = require('got')
const fetch = require('node-fetch')
const color = require('./lib/color')
const { spawn, exec } = require('child_process')
const { ma, men, infobot } = require('./lib/help')
const { berita, fasilitas, jadwalkuliah, keuangan, logo, lokasi, reg, bantuan, web, siakad } = require('./lib/com')

moment.tz.setDefault('Asia/Jakarta').locale('id')

module.exports = msgHandler = async(client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const args = commands.split(' ')

        const msgs = (message) => {
            if (command.startsWith('!')) {
                if (message.length >= 10) {
                    return `${message.substr(0, 15)}`
                } else {
                    return `${message}`
                }
            }
        }

        const mess = {
            wait: '[ WAIT ] Sedang di proses⏳ silahkan tunggu sebentar ya kak😊',
            error: {
                Ki: '[❗] Bot tidak bisa mengeluarkan admin group!',
                Ad: '[❗] Tidak dapat menambahkan target, mungkin karena di private',
                Iv: '[❗] Link yang anda kirim tidak valid!'
            }
        }
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const botNumber = await client.getHostNumber()
        const blockNumber = await client.getBlockedIds()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        const ownerNumber = ["6282165163289@c.us"] // replace with your whatsapp number
        const isOwner = ownerNumber.includes(sender.id)
        const isBlocked = blockNumber.includes(sender.id)
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        if (!isGroupMsg && command.startsWith('')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname))
        if (isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname), 'in', color(formattedTitle))
            //if (!isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname))
            //if (isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname), 'in', color(formattedTitle))
        if (isBlocked) return
            //if (!isOwner) return
        switch (command) {
            case '!donasi':
            case '!donate':
                client.sendLinkWithAutoPreview(from, 'gausah donate kak, cukup follow https://www.instagram.com/_gii.31/ 😊', donate)
                break

                //admin menu
            case '!admin':
                client.sendText(from, ma)
                break

            case '!linkgroup':
                if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
                if (isGroupMsg) {
                    const inviteLink = await client.getGroupInviteLink(groupId);
                    client.sendLinkWithAutoPreview(from, inviteLink, `\nLink group *${name}*`)
                } else {
                    client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                }
                break
            case '!bc':
                if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot!', id)
                let msg = body.slice(4)
                const chatz = await client.getAllChatIds()
                for (let ids of chatz) {
                    var cvk = await client.getChatById(ids)
                    if (!cvk.isReadOnly) await client.sendText(ids, `[ Bot Beta-Tester Broadcast ]\n\n${msg}`)
                }
                client.reply(from, 'Broadcast Success!', id)
                break
            case '!adminlist':
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                let mimin = ''
                for (let admon of groupAdmins) {
                    mimin += `➸ @${admon.replace(/@c.us/g, '')}\n`
                }
                await client.sendTextWithMentions(from, mimin)
                break
            case '!ownergroup':
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                const Owner_ = chat.groupMetadata.owner
                await client.sendTextWithMentions(from, `Owner Group : @${Owner_}`)
                break
            case '!tagall':
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
                const groupMem = await client.getGroupMembers(groupId)
                let hehe = '╔══✪〘 Mention All 〙✪══\n'
                for (let i = 0; i < groupMem.length; i++) {
                    hehe += '╠➥'
                    hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
                }
                hehe += '╚═〘 BOT Beta-Tester 〙'
                await client.sendTextWithMentions(from, hehe)
                break
            case '!kickall':
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                const isGroupOwner = sender.id === chat.groupMetadata.owner
                if (!isGroupOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner group', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
                const allMem = await client.getGroupMembers(groupId)
                for (let i = 0; i < allMem.length; i++) {
                    if (groupAdmins.includes(allMem[i].id)) {
                        console.log('Upss this is Admin group')
                    } else {
                        await client.removeParticipant(groupId, allMem[i].id)
                    }
                }
                client.reply(from, 'Succes kick all member', id)
                break
            case '!leaveall':
                if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
                const allChats = await client.getAllChatIds()
                const allGroups = await client.getAllGroups()
                for (let gclist of allGroups) {
                    await client.sendText(gclist.contact.id, `Maaf bot sedang pembersihan, total chat aktif : ${allChats.length}`)
                    await client.leaveGroup(gclist.contact.id)
                }
                client.reply(from, 'Succes leave all group!', id)
                break
            case '!clearall':
                if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot', id)
                const allChatz = await client.getAllChats()
                for (let dchat of allChatz) {
                    await client.deleteChat(dchat.id)
                }
                client.reply(from, 'Succes clear all chat!', id)
                break
            case '!add':
                const orang = args[1]
                if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                if (args.length === 1) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *!add* 628xxxxx', id)
                if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
                try {
                    await client.addParticipant(from, `${orang}@c.us`)
                } catch {
                    client.reply(from, mess.error.Ad, id)
                }
                break
            case '!kick':
                if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
                if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan Perintah ini, kirim perintah *!kick* @tagmember', id)
                await client.sendText(from, `Perintah diterima, mengeluarkan:\n${mentionedJidList.join('\n')}`)
                for (let i = 0; i < mentionedJidList.length; i++) {
                    if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, mess.error.Ki, id)
                    await client.removeParticipant(groupId, mentionedJidList[i])
                }
                break
            case '!leave':
                if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
                if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
                await client.sendText(from, 'Sayonara').then(() => client.leaveGroup(groupId))
                break
            case '!promote':
                if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
                if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *!promote* @tagmember', id)
                if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 user.', id)
                if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut sudah menjadi admin.', id)
                await client.promoteParticipant(groupId, mentionedJidList[0])
                await client.sendTextWithMentions(from, `Perintah diterima, menambahkan @${mentionedJidList[0]} sebagai admin.`)
                break
            case '!demote':
                if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
                if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *!demote* @tagadmin', id)
                if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 orang.', id)
                if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut tidak menjadi admin.', id)
                await client.demoteParticipant(groupId, mentionedJidList[0])
                await client.sendTextWithMentions(from, `Perintah diterima, menghapus jabatan @${mentionedJidList[0]}.`)
                break
            case '!join':
                //return client.reply(from, 'Jika ingin meng-invite bot ke group anda, silahkan izin ke wa.me/6285892766102', id)
                if (args.length <= 1) return client.reply(from, 'Kirim perintah *!join linkgroup key*\n\nEx:\n!join https://chat.whatsapp.com/blablablablablabla', id)
                const link = body.slice(6)
                const tGr = await client.getAllGroups()
                const minMem = 5
                const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
                const check = await client.inviteInfo(link)
                if (!isLink) return client.reply(from, 'Ini link? 👊🤬', id)
                if (tGr.length > 15) return client.reply(from, 'Maaf jumlah group sudah maksimal!', id)
                if (check.size < minMem) return client.reply(from, 'Member group tidak melebihi 5, bot tidak bisa masuk', id)
                if (check.status === 200) {
                    await client.joinGroupViaLink(link).then(() => client.reply(from, 'Bot akan segera masuk!'))
                } else {
                    client.reply(from, 'Link group tidak valid!', id)
                }
                break

            case '!delete':
                if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
                if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
                if (!quotedMsg) return client.reply(from, 'Salah!!, kirim perintah *!delete [tagpesanbot]*', id)
                if (!quotedMsgObj.fromMe) return client.reply(from, 'Salah!!, Bot tidak bisa mengahpus chat user lain!', id)
                client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
                break
            case '!listblock':
                let hih = `This is list of blocked number\nTotal : ${blockNumber.length}\n`
                for (let i of blockNumber) {
                    hih += `➸ @${i.replace(/@c.us/g,'')}\n`
                }
                client.sendTextWithMentions(from, hih, id)
                break
            case '!infobot':
                client.reply(from, infobot, id)
                break
            case '!menu':
            case '!Menu':
                client.reply(from, men, id)
                break
            case '!berita':
                client.reply(from, berita, id)
                break
            case '!fasilitas':
                client.sendText(from, fasilitas)
                break
                // case '!jadwalkuliah':
                //     client.sendText(from, jadwalkuliah)
                //     break
            case '!kodepembayaran':
                client.sendFile(from, './media/img/keuangan.jpeg', 'keuangan.jpeg', 'Contoh pembayaran Briva *77867(NPM kamu)(kode pembayaran)*', id)
                break
            case '!Logo':
            case '!logo':
            case '!LogoFakultas':
            case '!Logofakultas':
            case '!logofakultas':
                client.reply(from, logo, id)
                break
            case '!ulb':
                client.sendFile(from, './media/img/ulb.jpg', id)
                break
            case '!fst':
                client.sendFile(from, './media/img/fst.jpeg', id)
                break
            case '!fh':
                client.sendFile(from, './media/img/hukum.jpeg', id)
                break
            case '!feb':
                client.sendFile(from, './media/img/feb.jpeg', id)
                break
            case '!fkip':
                client.sendFile(from, './media/img/STKIP.png', id)
                break
            case '!lokasi':
                client.reply(from, lokasi, id)
                break
            case '!Registrasi':
            case '!registrasi':
                client.reply(from, reg, id)
                break
            case '!siakad':
                client.reply(from, siakad, id)
                break
            case '!websiteulb':
                client.reply(from, web, id)
                break
            case '!bantuan':
                client.reply(from, bantuan, id)
                break
            case '!hai':
                client.reply(from, 'hai kak, ada yang bisa di bantu', id)
                client.sendText(from, 'kalau ada yang ingin di tanyakan send \n*!menu*', id)
                break
            case "!assalamu'alaikum ":
            case '!assalamualaikum':
                client.reply(from, "wa'alaikumsalam kak, ada yang bisa di bantu ", id)
                client.sendText(from, 'kalau ada yang ingin di tanyakan send \n*!menu*', id)
                break
            case '!pagi':
                client.reply(from, 'Selamat pagi kak, ada yang bisa di bantu', id)
                client.sendText(from, 'kalau ada yang ingin di tanyakan send \n*!menu*', id)
                break
            case '!siang':
                client.reply(from, 'selamat siang kak, ada yang bisa di bantu', id)
                client.sendText(from, 'kalau ada yang ingin di tanyakan send \n*!menu*', id)
                break
            case '!malam':
                client.reply(from, 'selamat malam kak, ada yang bisa di bantu', id)
                client.sendText(from, 'kalau ada yang ingin di tanyakan send \n*!menu*', id)
                break
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}