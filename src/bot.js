const qrTerm = require('qrcode-terminal')
const { Wechaty } = require('wechaty')
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
		const destination = msg.to()
		const content = msg.text()

		if (msg.self() && (destination && destination.self())) {
			if ('群发模式' === content) {
				forwardingMode = !forwardingMode
				await msg.say(`群发模式已${forwardingMode ? '开启' : '关闭'}`)
				return
			}

			if (forwardingMode && !/群发模式/.test(content)) {
				const contact = await bot.Room.find({
					topic: 'Hotnode篮球队',
				})
				setTimeout(async () => {
					await msg.forward(contact)
				}, getRandomArbitrary(0, 3000))
			}
		}
	})
	.on('logout', user => {
		console.log(`${user} logout`)
	})
	.start()
	.catch(console.error)
