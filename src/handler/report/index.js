const moment = require('moment')
const accounting = require('accounting')
const Raven = require('raven')
const R = require('ramda')
const requestPromise = require('request-promise')

const { getProjectNews } = require('../news')
const { getLatestTweet } = require('../twitter')
const { getTokenInfo, percentageFormat } = require('../coin')
const { delay, formatPercentage } = require('../../helper/common')

moment.locale('zh-cn')

const generateReportData = async projects => {
	let reportData = []
	for (const item of projects) {
		const data = await requestPeport(item)
		console.log(data)
		reportData = [...reportData, data]
	}
	return reportData
}

const inDateRange = date => {
	return date.isSame(moment(), 'day')
}

const requestPeport = async p => {
	try {
		await delay(3000)

		// news
		const res = await getProjectNews(p)
		if (res) {
			const { item, date } = res
			const newsDate = moment(date)
			if (inDateRange(newsDate)) {
				p['news'] = item.content
			}
		}

		// tweet
		const tweet = await getLatestTweet(p)
		if (tweet) {
			const tweetDate = moment(tweet.created_at)
			if (inDateRange(tweetDate)) {
				p['tweet'] = tweet.text
			}
		}

		// token info
		if (p.news || p.tweet) {
			// request token
			if (p.token) {
				const tokenInfo = await getTokenInfo({
					token: p.token,
					id: p.coingecko_id,
				})
				if (tokenInfo) {
					const percent_change_24h = R.path([
						'market_data',
						'price_change_percentage_24h',
					])(tokenInfo)
					// check percentage change abs
					if (Math.abs(percent_change_24h) > 10) {
						p['price_usd'] = R.path(['market_data', 'current_price', 'usd'])(
							tokenInfo,
						)
						p['price_cny'] = R.path(['market_data', 'current_price', 'cny'])(
							tokenInfo,
						)
						p['percent_change_24h'] = percent_change_24h
						p['percent_change_7d'] = R.path([
							'market_data',
							'price_change_percentage_7d',
						])(tokenInfo)
					}
				}
			}
		}
	} catch (e) {
		if (e) {
			Raven.captureException(e)
		}
	}
	return p
}

const createReport = r => {
	const title = `${r.name}${(r.token && ` (${r.token}) `) || ''}：\n\n`
	const news = `${(r.news && `动态：${r.news}\n`) || ''}`
	const tweet = `${(r.tweet && `Twitter：${r.tweet}\n`) || ''}`
	const price = `${(r.price_usd &&
		r.price_cny &&
		`现价：${accounting.formatMoney(r.price_usd)}/${accounting.formatMoney(
			r.price_cny,
			'￥',
		)}\n`) ||
		''}`
	const percentage_change = `${(r.percent_change_24h &&
		r.percent_change_7d &&
		`涨跌幅：${percentageFormat(
			r.percent_change_24h,
		)} (24小时), ${percentageFormat(r.percent_change_7d)} (7天)\n`) ||
		''}`

	return `${title}${news}${tweet}${price}${percentage_change}`
}

const generateReport = async () => {
	// get project list
	const projects = await requestPromise({
		uri: 'http://api.hotnode.io/v1/projects/robot-list',
		json: true,
	})

	// iterate
	const report_raw = await generateReportData(projects)
	let report_text =
		report_raw
			.filter(r => r.news || r.tweet)
			.map(createReport)
			.join('\n') || '今日暂无项目投后动态-_-'

	// return it
	return {
		text: report_text,
		subject: `${moment().format('LL')}投后项目动态汇总`,
	}
}

module.exports = {
	generateReport,
}
