const request = require('request')
const requestPromise = require('request-promise')
const accounting = require('accounting')
const R = require('ramda')

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
					`总市值：${accounting.formatMoney(
						total_market_cap_usd
					)}\n24小时总交易量：${accounting.formatMoney(
						total_24h_volume_usd
					)}\nBTC占比：${bitcoin_percentage_of_market_cap}%`
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
					let {
						symbol,
						rank,
						price_usd,
						price_cny,
						percent_change_1h,
						percent_change_24h,
						percent_change_7d
					} = crypto

					// percentage formatting
					percent_change_1h = `${
						/-/.test(percent_change_1h) ? '↓' : '↑'
					}${percent_change_1h}%`
					percent_change_24h = `${
						/-/.test(percent_change_24h) ? '↓' : '↑'
					}${percent_change_24h}%`
					percent_change_7d = `${
						/-/.test(percent_change_7d) ? '↓' : '↑'
					}${percent_change_7d}%`

					message.say(
						`币种：${symbol}\n市值排名：${rank}\n现价：${accounting.formatMoney(
							price_usd
						)}/${accounting.formatMoney(
							price_cny,
							'￥'
						)}\n涨跌幅：\n${percent_change_1h}（1小时）\n${percent_change_24h}（1天）\n${percent_change_7d}（7天）`
					)
				}
			}
		}
	)
}

const requestTokenList = async () => {
	try {
		const { data } = await requestPromise({
			uri: 'https://api.coinmarketcap.com/v2/listings/',
			json: true
		})
		if (R.and(!R.isNil(data), !R.isEmpty(data))) {
			return Promise.resolve(data)
		}
		return Promise.reject(data)
	} catch (error) {
		return Promise.reject(error)
	}
}

const getTokenId = async token => {
	try {
		const list = await requestTokenList()
		const capToken = R.toUpper(token)
		const tokenObj = R.find(R.propEq('symbol', capToken))(list)
		if (!R.isNil(tokenObj)) {
			return Promise.resolve(tokenObj.id)
		}
		return Promise.reject(tokenId)
	} catch (error) {
		return Promise.reject(error)
	}
}

const getTokenInfo = async token => {
	try {
		const tokenId = await getTokenId(token)
		const { data } = await requestPromise({
			uri: `https://api.coinmarketcap.com/v2/ticker/${tokenId}/`,
			qs: {
				convert: 'CNY'
			},
			json: true
		})
		if (!R.isNil(data)) {
			return Promise.resolve(data)
		}
		return Promise.reject(data)
	} catch (error) {
		return Promise.reject(error)
	}
}

const handleCoinMsg = message => {
	const content = message.content().trim()

	// total marketcap
	if (content === '市值' || content === '总市值' || content === 'marketcap') {
		requestTotalMarketCap(message)
	}

	// 100 tokens
	request100Token(message)
}

module.exports = {
	handleCoinMsg,
	getTokenInfo,
	requestTokenList,
	getTokenId
}
