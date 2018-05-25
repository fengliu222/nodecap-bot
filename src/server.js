const app = require('express')()
const { handleCoinMsg } = require('./handler/coin')
const { bot } = require('./bot')
// get ranking
app.get('/api/nodus-bot', async (req, res) => {
	// replace this block with stuff in onMessage
	const params = req.query;
	const data = await bot(params)
	res.json({
		data: data || 'empty_message'
	})
})

app.listen(9001)
