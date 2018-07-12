const Schedule = require('node-schedule')
const Raven = require('raven')
const qrTerm = require('qrcode-terminal')
const { Wechaty } = require('wechaty')
const { FileBox } = require('file-box')

const { bot: replyBot } = require('./bot')
const { mail } = require('./handler/mail')
const { generateReport } = require('./handler/report')
const { generateWeeklyReport } = require('./handler/report/weekly')
const { login } = require('./handler/auth')

Raven.config(
	'https://ec41621ea39d46a2bc8cf0acab3fac43@sentry.io/1199485',
).install()

Schedule.scheduleJob('50 20 * * *', async () => {
	const { text, subject } = await generateReport()
	mail({ text, subject })
})

Schedule.scheduleJob('20 21 * * 7', async () => {
	const { text, subject } = await generateWeeklyReport()
	mail({ text, subject })
})

Schedule.scheduleJob('0 0 * * *', async () => {
	await login()
})

const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min

const bot = new Wechaty()

bot
	.on('scan', (qrcode, status) => {
		qrTerm.generate(qrcode, { small: true }) // show qrcode on console

		const qrcodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
			qrcode,
		)}&size=220x220&margin=20`

		console.log(qrcodeImageUrl)
	})
	.on('login', user => {
		console.log(`${user} login`)
	})
	.on('room-join', async (room, inviteeList, inviter) => {
		const topic = await room.topic()
		if (/Hotnode x|x Hotnode/.test(topic)) {
			const intro =
				'老板好🙇，hotnode是源自Token Fund日常工作需要而衍生的一款企业资管工具，包含了基金收益率实时统计、项目募投管退管理、权限设置、人脉管理等功能。目前产品已经完成了4.0版本，还处于不断迭代之中，还希望老板在使用过程中多给我们提提意见，帮助Hodenode更快成长，更加契合老板在工作中的需求。\n\n此群是咱们Fund的专属群，群内包含了Hotnode的产品经理、工程师、客户经理，能够7*24随时在线，回答老板在使用过程中可能遇到的各类问题。😄\n\n下图是Hotnode的产品使用手册，里面包含了项目的研发背景、首次启动步骤、各项功能的具体使用方式，望查看。'
			const manual = FileBox.fromFile(`${__dirname}/data/Hotnode产品手册v1.pdf`)
			const download =
				'1、Web端访问地址：http://www.hotnode.io\n2、iOS下载：https://fir.im/hotnode\n3、Android下载：https://fir.im/hotnodeAndroid'

			await room.say(intro)
			await room.say(manual)
			await room.say(download)
		}

		console.log(`Room ${topic}, invited by ${inviter}`)
	})
	.on('room-leave', (room, leaverList) => {
		const nameList = leaverList.map(c => c.name()).join(',')
		console.log(`Room ${room.topic()} lost member ${nameList}`)
	})
	.on('message', async msg => {
		if (msg.self()) return

		const room = msg.room()
		const contact = msg.from()
		const content = msg.text()

		let name
		if (room) {
			name = await room.topic()
			name = `${contact.name()}：${name}`
		} else {
			name = contact.name()
		}

		const response = await replyBot({ name, content })

		if (response) {
			setTimeout(async () => {
				await msg.say(response)
				console.log(name, content)
			}, getRandomArbitrary(0, 3000))
		}
	})
	.on('logout', user => {
		console.log(`${user} logout`)
	})
	.start()
	.catch(console.error)
