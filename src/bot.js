// dependencies
const { Wechaty } = require('wechaty')
const QRCode = require('qrcode-terminal')
const Schedule = require('node-schedule')
const Raven = require('raven')

// modules
const { handleCoinMsg } = require('./handler/coin')
const { handleInvestmentQuery } = require('./handler/chat/investment')
const { chat } = require('./handler/chat')
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
	})
	.on('room-leave', (room, leaverList) => {
		const nameList = leaverList.map(c => c.name()).join(',')
		console.log(`Room ${room.topic()} lost member ${nameList}`)
	})
	.on('message', async message => {
		const contact = message.from()
		const content = message.content()
		const room = message.room()

		if (message.self()) {
			return
		}

		const name = await contact.name()
		if (name === '杜均') {
			const res = await handleInvestmentQuery(message)
			if (res) {
				message.say(res)
			} else {
				const coinMsg = await handleCoinMsg(message)
				if (coinMsg) {
					message.say(coinMsg)
				} else {
					const chatRes = await chat(message)
					message.say(chatRes)
				}
			}
			return
		}

		if (room) {
			const topic = await room.topic()
			if (topic === 'Hotnode-项目查询') {
				const res = await handleInvestmentQuery(message)
				if (res) {
					message.say(res)
				} else {
					const coinMsg = await handleCoinMsg(message)
					if (coinMsg) {
						message.say(coinMsg)
					} else {
						if (name === '杜均') {
							const chatRes = await chat(message)
							message.say(chatRes)
						}
					}
				}
				return
			}
		}

		if (/你好/.test(content)) {
			message.say('雷猴，我是币猴')
		}

		if (/图样|图森破/.test(content)) {
			message.say('Sometimes Naïve')
		}

		if (/华莱士/.test(content)) {
			message.say('不知道高到哪里去了')
		}

		if (/苟利国家生死以/.test(content)) {
			message.say('岂因祸福避趋之')
		}

		if (/香港记者/.test(content)) {
			message.say('跑得快')
		}

		if (/西方/.test(content)) {
			message.say('哪个国家我没去过')
		}

		if (/水至清则无鱼/.test(content)) {
			message.say('人至贱则无敌')
		}

		const coinMsg = await handleCoinMsg(message)
		if (coinMsg) {
			message.say(coinMsg)
		}
	})
	.on('logout', user => {
		console.log(`${user} logout`)

		// cancel scheduler
		dailyJob.cancel()
		weeklyJob.cancel()
	})
	.start()
