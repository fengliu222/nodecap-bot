const request = require('request')

const handleCoinMsg = message => {
	const content = message.content().toLowerCase()
	request.get(
		'https://api.coinmarketcap.com/v1/ticker/?convert=CNY',
		(error, res) => {
			if (res && res.statusCode === 200) {
				const data = JSON.parse(res.body)
				const crypto = data.find(
					c => c.id === content || c.symbol.toLowerCase() === content
				)
				if (crypto) {
					message.say(
						`币种: ${crypto.symbol}\n市值排名: ${
							crypto.rank
						}\n现价: $${crypto.price_usd}/￥${
							crypto.price_cny
						}\n涨跌幅(%): ${crypto.percent_change_1h}(1小时), ${
							crypto.percent_change_24h
						}(24小时), ${crypto.percent_change_7d}(7天)`
					)
				}
			}
		}
	)
}

module.exports = {
	handleCoinMsg
}
