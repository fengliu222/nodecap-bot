const request = require('request')
const accounting = require('accounting')

const requestTotalMarketCap = message => {
	request.get(
		'https://api.coinmarketcap.com/v1/global/?convert=CNY',
		(error, res) => {
			if (res && res.statusCode === 200) {
				const {
					total_market_cap_usd,
					total_24h_volume_usd,
					bitcoin_percentage_of_market_cap
				} = JSON.parse(res.body)
				message.say(
					`总市值: ${accounting.formatMoney(
						total_market_cap_usd
					)}\n24小时总交易量: ${accounting.formatMoney(
						total_24h_volume_usd
					)}\nBTC占比(%): ${bitcoin_percentage_of_market_cap}\n`
				)
			}
		}
	)
}

const request100Token = message => {
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
					const {
						symbol,
						rank,
						price_usd,
						price_cny,
						percent_change_1h,
						percent_change_24h,
						percent_change_7d
					} = crypto
					message.say(
						`币种: ${symbol}\n市值排名: ${rank}\n现价: ${accounting.formatMoney(
							price_usd
						)}/${accounting.formatMoney(
							price_cny,
							'￥'
						)}\n涨跌幅(%): ${percent_change_1h}(1h), ${percent_change_24h}(24h), ${percent_change_7d}(7d)`
					)
				}
			}
		}
	)
}

const handleCoinMsg = message => {
	const content = message.content()

	// total marketcap
	if (/市值|marketcap/.test(content)) {
		requestTotalMarketCap(message)
	}

	// 100 tokens
	request100Token(message)
}

module.exports = {
	handleCoinMsg
}
