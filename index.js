const { create, Client } = require('@open-wa/wa-automate')
const msgHandler = require('./msgHndlr')
const options = require('./options')

const start = async(client = new Client()) => {
    console.log('[SERVER] Server Started!')
        // Force it to keep the current session
    client.onStateChanged((state) => {
            console.log('[Client State]', state)
            if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
        })
        // listening on message
    client.onMessage((async(message) => {
        client.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 3000) {
                    client.cutMsgCache()
                }
            })
        msgHandler(client, message)
    }))

    client.onIncomingCall((async(call) => {
        await client.sendText(call.peerJid, 'Maaf, saya tidak bisa menerima panggilan. nelfon = block!')
            .then(() => client.contactBlock(call.peerJid))
    }))
}

create(options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))