const request = require('request')
const requestPromise = require('request-promise')
const accounting = require('accounting')
const Raven = require('raven')
const R = require('ramda')

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
		const lowerToken = R.toLower(token)
		const tokenObj =
			R.find(R.propEq('symbol', capToken))(list) ||
			R.find(R.propEq('website_slug', lowerToken))(list)
		if (!R.isNil(tokenObj)) {
			return Promise.resolve(tokenObj.id)
		}
		return Promise.reject(tokenObj)
	} catch (error) {
		return Promise.reject(error)
	}
}

const getTokenInfo = async token => {
	if (R.isNil(token)) return
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

const formatTokenInfo = info => {
	// pre-handling
	const percent_change_1h = R.path(['quotes', 'USD', 'percent_change_1h'])(info)
	const percent_change_24h = R.path(['quotes', 'USD', 'percent_change_24h'])(
		info
	)
	const percent_change_7d = R.path(['quotes', 'USD', 'percent_change_7d'])(info)

	// fields
	const token = `币种：${R.path(['symbol'])(info)}（${R.path(['name'])(
		info
	)}）\n`
	const rank = `市值排名：${R.path(['rank'])(info)}\n`
	const price = `现价：${accounting.formatMoney(
		R.path(['quotes', 'USD', 'price'])(info)
	)} / ${accounting.formatMoney(
		R.path(['quotes', 'CNY', 'price'])(info),
		'￥'
	)}\n`
	const volume_24h = `24小时交易量：${moneyFormat(
		R.path(['quotes', 'USD', 'volume_24h'])(info)
	)} / ${moneyFormat(R.path(['quotes', 'CNY', 'volume_24h'])(info), '￥')}\n`
	const market_cap = `总市值：${moneyFormat(
		R.path(['quotes', 'USD', 'market_cap'])(info)
	)} / ${moneyFormat(R.path(['quotes', 'CNY', 'market_cap'])(info), '￥')}\n`
	const percent_change = `涨跌幅：\n${percentageFormat(
		percent_change_1h
	)}（1小时）\n${percentageFormat(
		percent_change_24h
	)}（1天）\n${percentageFormat(percent_change_7d)}（7天）`

	return `${token}${rank}${price}${volume_24h}${market_cap}${percent_change}`
}

const percentageFormat = percentage => {
	if (percentage) {
		return `${/-/.test(percentage) ? '↓' : '↑'} ${percentage}%`
	}
	return `未收录`
}

const moneyFormat = (amount, symbol = '$') => {
	if (amount > 100000000) {
		return `${symbol}${(amount / 100000000).toFixed(2)}亿`
	}
	if (amount > 10000) {
		return `${symbol}${(amount / 10000).toFixed(1)}万`
	}
	if (amount) {
		return `${symbol}${amount}`
	}
	return `${symbol}未收录`
}

const handleCoinMsg = async message => {
	const content = R.trim(
		typeof message === 'string' ? message : message.content()
	)
	try {
		const tokenInfo = await getTokenInfo(content)
		if (tokenInfo) {
			return formatTokenInfo(tokenInfo)
		}
	} catch (error) {
		if (error) {
			Raven.captureException(error)
		}
	}
}

module.exports = {
	handleCoinMsg,
	getTokenInfo,
	requestTokenList,
	getTokenId,
	formatTokenInfo,
	percentageFormat
}
