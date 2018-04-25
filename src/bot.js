// dependencies
const { Wechaty } = require('wechaty')
const QRCode = require('qrcode-terminal')
const Schedule = require('node-schedule')

// modules
const { handleCoinMsg } = require('./handlers/coin')
const { handleExchangeMsg } = require('./handlers/exchange')

const bot = Wechaty.instance()

bot
	.on('scan', (url, code) => {
		if (!/201|200/.test(code)) {
			const loginUrl = url.replace(/\/qrcode\//, '/l/')
			QRCode.generate(loginUrl)
		}
	})
	.on('login', user => {
		console.log(`${user} login`)
	})
	.on('friend', async (contact, request) => {
		if (request) {
			await request.accept()
			console.log(
				`Contact: ${contact.name()} send request ${request.hello}`
			)
		}
	})
	.on('message', async message => {
		const contact = message.from()
		const content = message.content()
		const room = message.room()

		if (room) {
			console.log(
				`Room: ${room.topic()} Contact: ${contact.name()}: ${content}`
			)
		} else {
			console.log(`Contact: ${contact.name()}: ${content}`)
		}

		if (message.self()) {
			return
		}

		if (/hello|你好/.test(content)) {
			message.say('你好，我是币汪')
		}

		await handleCoinMsg(message)
		await handleExchangeMsg(message)

		// message.say('Sorry, 听不太懂了-_-')
	})
	.on('logout', user => {
		console.log(`${user} logout`)
	})
	.start()

Schedule.scheduleJob('0 0 20 * * *', () => {
	bot.say('The answer to life, the universe, and everything!')
})
