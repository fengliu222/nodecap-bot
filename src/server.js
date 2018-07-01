const Schedule = require('node-schedule')
const Raven = require('raven')

const app = require('express')()
const { bot } = require('./bot')
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

app.get('/api/nodus-bot', async (req, res) => {
	const params = req.query
	const data = await bot(params)

	setTimeout(() => {
		res.json({
			data: data || 'empty_message',
		})
	}, getRandomArbitrary(0, 3000))
})

app.listen(9001)
