const app = require('express')()
const { handleCoinMsg } = require('./handler/coin')

// get ranking
app.get('/api/nodus-bot/:queryText', async ({ params: { queryText } }, res) => {
	// replace this block with stuff in onMessage

	const data = await handleCoinMsg(queryText)
	res.json({
		data
	})
})

app.listen(9000)
