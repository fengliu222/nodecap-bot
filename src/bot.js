const { Wechaty } = require('wechaty')
const QRCode = require('qrcode-terminal')

Wechaty.instance()
	.on('scan', (url, code) => {
		if (!/201|200/.test(code)) {
			const loginUrl = url.replace(/\/qrcode\//, '/l/')
			QRCode.generate(loginUrl)
		}
	})
	.on('message', message => {
		const contact = message.from()
		const content = message.content()
		const room = message.room()

		if (room) {
			console.log(
				`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`
			)
		} else {
			console.log(`Contact: ${contact.name()} Content: ${content}`)
		}

		if (message.self()) {
			return
		}

		if (/hello/.test(content)) {
			message.say('hello how are you')
		}

		if (/yo/.test(content)) {
			message.say('药药切克闹')
		}
	})
	.start()
