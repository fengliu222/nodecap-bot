const Schedule = require('node-schedule')
const Raven = require('raven')

const app = require('express')()
const { bot } = require('./bot')
const { mail } = require('./handler/mail')
const { generateReport } = require('./handler/report')

Raven.config(
	'https://ec41621ea39d46a2bc8cf0acab3fac43@sentry.io/1199485',
).install()

Schedule.scheduleJob('50 20 * * *', async () => {
	const { text, subjuct } = await generateReport()
	mail({ text, subject })
})

app.get('/api/nodus-bot', async (req, res) => {
	const params = req.query
	const data = await bot(params)
	res.json({
		data: data || 'empty_message',
	})
})

app.listen(9001)
