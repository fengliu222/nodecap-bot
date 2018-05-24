const app = require('express')()
const { handleCoinMsg } = require('./handler/coin')
const { bot } = require('./bot')
// get ranking
app.get('/api/nodus-bot', async (req, res) => {
	// replace this block with stuff in onMessage
	const params = req.query;
	console.log('params', params);
	const data = await bot(params)
	res.json({
		data
	})
})

app.listen(9001)
