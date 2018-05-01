// dependencies
const { Wechaty } = require('wechaty')
const QRCode = require('qrcode-terminal')
const Schedule = require('node-schedule')

// modules
const { handleCoinMsg } = require('./handler/coin')
const { generateReport } = require('./handler/report')

const bot = Wechaty.instance()
var job

bot
	.on('scan', (url, code) => {
		if (/201|200/.test(code)) {
			return
		}
		const loginUrl = url.replace(/\/qrcode\//, '/l/')
		QRCode.generate(loginUrl)
	})
	.on('login', user => {
		console.log(`${user} login`)

		// start scheduler
		job = Schedule.scheduleJob('0 0 18 * * *', () => {
			generateReport()
		})
	})
	.on('friend', async (contact, request) => {
		if (request) {
			await request.accept()
			console.log(`Contact: ${contact.name()} send request ${request.hello}`)
		}
	})
	.on('room-join', (room, inviteeList, inviter) => {
		const nameList = inviteeList.map(c => c.name()).join(',')
		console.log(
			`Room ${room.topic()} got new member ${nameList}, invited by ${inviter}`
		)

		// say hello
		room.say('雷猴')
	})
	.on('room-leave', (room, leaverList) => {
		const nameList = leaverList.map(c => c.name()).join(',')
		console.log(`Room ${room.topic()} lost member ${nameList}`)
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

		// message.say('Sorry, 听不太懂了-_-')
	})
	.on('logout', user => {
		console.log(`${user} logout`)

		// cancel scheduler
		job.cancel()
	})
	.start()
