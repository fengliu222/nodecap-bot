// dependencies
const { Wechaty } = require('wechaty')
const QRCode = require('qrcode-terminal')
const Schedule = require('node-schedule')
const Raven = require('raven')

// modules
const { handleCoinMsg } = require('./handler/coin')
const { handleInvestmentQuery } = require('./handler/chat/investment')
const { generateReport } = require('./handler/report')
const { generateWeeklyReport } = require('./handler/report/weekly')

// Raven init
Raven.config(
	'https://ec41621ea39d46a2bc8cf0acab3fac43@sentry.io/1199485'
).install()

// Start wechaty
var dailyJob
var weeklyJob
Wechaty.instance()
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
		dailyJob = Schedule.scheduleJob('50 20 * * *', () => {
			generateReport()
		})

		weeklyJob = Schedule.scheduleJob('50 21 * * 7', () => {
			generateWeeklyReport()
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

		await handleCoinMsg(message)
		await handleInvestmentQuery(message)
		// message.say('Sorry, 听不太懂了-_-')
	})
	.on('logout', user => {
		console.log(`${user} logout`)

		// cancel scheduler
		dailyJob.cancel()
		weeklyJob.cancel()
	})
	.start()
