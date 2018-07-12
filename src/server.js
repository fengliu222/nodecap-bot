const Schedule = require('node-schedule')
const Raven = require('raven')
const qrTerm = require('qrcode-terminal')
const { Wechaty, Room } = require('wechaty')

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

// app.get('/api/nodus-bot', async (req, res) => {
// 	const params = req.query
// 	const data = await bot(params)

// 	setTimeout(() => {
// 		res.json({
// 			data: data || 'empty_message',
// 		})
// 	}, getRandomArbitrary(0, 3000))
// })

// app.listen(9001)

const bot = new Wechaty()

bot.on('scan', (qrcode, status) => {
	qrTerm.generate(qrcode, { small: true }) // show qrcode on console

	const qrcodeImageUrl = [
		'https://api.qrserver.com/v1/create-qr-code/?data=',
		encodeURIComponent(qrcode),
		'&size=220x220&margin=20',
	].join('')

	console.log(qrcodeImageUrl)
})
bot.on('login', user => {
	console.log(`${user} login`)
})
bot.on('logout', user => {
	console.log(`${user} logout`)
})
bot.on('message', async msg => {
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

	setTimeout(() => {
		msg.say(response)
	}, getRandomArbitrary(0, 3000))

	console.log(name, content)
})

bot.start().catch(console.error)
