const qrTerm = require('qrcode-terminal')
const { Wechaty, Friendship } = require('wechaty')
const { FileBox } = require('file-box')
const R = require('ramda')

const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min

let forwardingMode = false

const bot = new Wechaty()

bot
	.on('scan', (qrcode, status) => {
		qrTerm.generate(qrcode, { small: true }) // show qrcode on console

		const qrcodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
			qrcode,
		)}&size=220x220&margin=20`

		console.log(qrcodeImageUrl)
	})
	.on('login', async user => {
		console.log(`${user} login`)
	})
	.on('message', async msg => {
		const room = msg.room()
		const contact = msg.from()
		const destination = msg.to()
		const content = msg.text()

		let name
		if (room) {
			name = await room.topic()
			name = `${name}：${contact.name()}`
		} else {
			name = contact.name()
		}

		if (destination && destination.self()) {
			if ('群发模式' === content) {
				forwardingMode = !forwardingMode
				// await msg.say(`群发模式已${forwardingMode ? '开启' : '关闭'}`)
				console.log(`群发模式已${forwardingMode ? '开启' : '关闭'}`)
				return
			}

			if (forwardingMode) {
				const room = await bot.Room.find({
					topic: 'Hotnode篮球队',
				})
				// await room.say(content)
				await msg.forward(room)
			}

			return
		}

		// if (response) {
		// 	setTimeout(async () => {
		// 		await msg.say(response)
		// 	}, getRandomArbitrary(0, 3000))
		// }
	})
	.on('logout', user => {
		console.log(`${user} logout`)
	})
	.start()
	.catch(console.error)
