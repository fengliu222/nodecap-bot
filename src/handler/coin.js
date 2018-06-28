const request = require('request')
const requestPromise = require('request-promise')
const accounting = require('accounting')
const Raven = require('raven')
const R = require('ramda')

const requestTokenList = async () => {
	try {
		const data = await requestPromise({
			uri: 'https://api.coingecko.com/api/v3/coins/list',
			json: true,
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
		const lowerToken = R.toLower(token)
		const tokenObj = R.find(R.propEq('symbol', lowerToken))(list)
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
		const data = await requestPromise({
			uri: `https://api.coingecko.com/api/v3/coins/${tokenId}`,
			json: true,
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
	// const percent_change_1h = R.path(['quotes', 'USD', 'percent_change_1h'])(info)
	const percent_change_24h = R.path([
		'market_data',
		'price_change_percentage_24h',
	])(info)
	const percent_change_7d = R.path([
		'market_data',
		'price_change_percentage_7d',
	])(info)

	// fields
	const token = `${R.toUpper(R.path(['symbol'])(info))}（${R.path(['name'])(
		info,
	)}）\n\n`
	// const rank = `市值排名：${R.path(['rank'])(info)}\n`
	const price = `现价：${accounting.formatMoney(
		R.path(['market_data', 'current_price', 'usd'])(info),
	)} / ${accounting.formatMoney(
		R.path(['market_data', 'current_price', 'cny'])(info),
		'￥',
	)}\n`
	const volume_24h = `24小时交易量：${moneyFormat(
		R.path(['market_data', 'volume_change_24h'])(info),
		'',
	)} ${R.path(['symbol'])(info)}\n`
	const market_cap = `总市值：${moneyFormat(
		R.path(['market_data', 'market_cap', 'usd'])(info),
	)} / ${moneyFormat(
		R.path(['market_data', 'market_cap', 'cny'])(info),
		'￥',
	)}\n`

	const percent_change = `涨跌幅：\n${percentageFormat(
		percent_change_24h,
	)}（24小时）\n${percentageFormat(percent_change_7d)}（7天）\n`

	const market_data = `市场数据\n${price}${volume_24h}${market_cap}${percent_change}`

	const community_data = `\n社区活跃\nFacebook 点赞：${R.pathOr('暂无', [
		'community_data',
		'facebook_likes',
	])(info)}\nTwitter 关注：${R.pathOr('暂无', [
		'community_data',
		'twitter_followers',
	])(info)}\n`

	const developer_data = `\n开发活跃\nForks：${R.pathOr('暂无', [
		'developer_data',
		'forks',
	])(info)}\nStars：${R.pathOr('暂无', ['developer_data', 'stars'])(
		info,
	)}\nPR 合并：${R.pathOr('暂无', ['developer_data', 'pull_requests_merged'])(
		info,
	)}\nPR 贡献者：${R.pathOr('暂无', [
		'developer_data',
		'pull_request_contributors',
	])(info)}\n4周内 commit 数：${R.pathOr('暂无', [
		'developer_data',
		'commit_count_4_weeks',
	])(info)}\n`
	return `${token}${market_data}${community_data}${developer_data}`
}

const formatTokenInfoEnglish = info => {
	// pre-handling
	// const percent_change_1h = R.path(['quotes', 'USD', 'percent_change_1h'])(info)
	const percent_change_24h = R.path([
		'market_data',
		'price_change_percentage_24h',
	])(info)
	const percent_change_7d = R.path([
		'market_data',
		'price_change_percentage_7d',
	])(info)

	// fields
	const token = `${R.toUpper(R.path(['symbol'])(info))} (${R.path(['name'])(
		info,
	)}) \n\n`
	const price = `Current Price: ${accounting.formatMoney(
		R.path(['market_data', 'current_price', 'usd'])(info),
	)} / ${accounting.formatMoney(
		R.path(['market_data', 'current_price', 'cny'])(info),
		'￥',
	)}\n`
	const volume_24h = `24h Volume: ${moneyFormatEnglish(
		R.path(['market_data', 'volume_change_24h'])(info),
		'',
	)} ${R.path(['symbol'])(info)}\n`
	const market_cap = `Market Cap: ${moneyFormatEnglish(
		R.path(['market_data', 'market_cap', 'usd'])(info),
	)} / ${moneyFormatEnglish(
		R.path(['market_data', 'market_cap', 'cny'])(info),
		'￥',
	)}\n`

	const percent_change = `Price Change:\n${percentageFormat(
		percent_change_24h,
	)} (24h)\n${percentageFormat(percent_change_7d)} (7d)\n`

	const market_data = `Market Data\n${price}${market_cap}${percent_change}`

	const community_data = `\nCommunity Activeness\nFacebook likes: ${R.pathOr(
		'暂无',
		['community_data', 'facebook_likes'],
	)(info)}\nTwitter followers: ${R.pathOr('暂无', [
		'community_data',
		'twitter_followers',
	])(info)}\n`

	const developer_data = `\nDevelopment Activeness\nForks: ${R.pathOr('暂无', [
		'developer_data',
		'forks',
	])(info)}\nStars: ${R.pathOr('暂无', ['developer_data', 'stars'])(
		info,
	)}\nPR merged: ${R.pathOr('暂无', ['developer_data', 'pull_requests_merged'])(
		info,
	)}\nPR contributors: ${R.pathOr('暂无', [
		'developer_data',
		'pull_request_contributors',
	])(info)}\nCommit count in 4 weeks: ${R.pathOr('暂无', [
		'developer_data',
		'commit_count_4_weeks',
	])(info)}\n`
	return `${token}${market_data}${community_data}${developer_data}`
}

const percentageFormat = percentage => {
	if (percentage) {
		percentage = Number(percentage).toFixed(2)
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

const moneyFormatEnglish = (amount, symbol = '$') => {
	if (amount > 1000000000) {
		return `${symbol}${(amount / 1000000000).toFixed(2)} Billion`
	}
	if (amount > 1000000) {
		return `${symbol}${(amount / 1000000).toFixed(1)} Million`
	}
	if (amount > 1000) {
		return `${symbol}${(amount / 1000).toFixed(1)} Thousand`
	}
	if (amount) {
		return `${symbol}${amount}`
	}
	return `${symbol} not recorded`
}

const handleCoinMsg = async message => {
	const content = R.trim(
		typeof message === 'string' ? message : message.content,
	)
	const inEnglish = message.inEnglish
	try {
		const tokenInfo = await getTokenInfo(content)
		if (tokenInfo) {
			if (inEnglish) {
				return formatTokenInfoEnglish(tokenInfo)
			}
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
	percentageFormat,
}
