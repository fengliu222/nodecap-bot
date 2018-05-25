const app = require('express')()
const { bot } = require('./bot')

app.get('/api/nodus-bot', async (req, res) => {
	const params = req.query
	const data = await bot(params)
	res.json({
		data: data || 'empty_message'
	})
})

app.listen(9001)
