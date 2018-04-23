// dependencies
const { Wechaty } = require('wechaty')
const QRCode = require('qrcode-terminal')

// modules
const { handleCoinMsg } = require('./handlers/coin')

Wechaty.instance()
	.on('scan', (url, code) => {
		if (!/201|200/.test(code)) {
			const loginUrl = url.replace(/\/qrcode\//, '/l/')
			QRCode.generate(loginUrl)
		}
	})
	.on('login', user => {
		console.log(`${user} login`)
	})
	.on('message', message => {
		// const contact = message.from()
		// const content = message.content()
		// const room = message.room()
		//
		// if (room) {
		// 	console.log(
		// 		`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`
		// 	)
		// } else {
		// 	console.log(`Contact: ${contact.name()} Content: ${content}`)
		// }

		if (message.self()) {
			return
		}

		// if (/hello|你好/.test(content)) {
		// 	message.say('你好，我是币汪')
		// }
		//
		// if (/yo/.test(content)) {
		// 	message.say('药药切克闹')
		// }

		handleCoinMsg(message)
	})
	.start()
