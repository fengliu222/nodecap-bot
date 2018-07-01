const moment = require('moment')
const accounting = require('accounting')
const Raven = require('raven')
const R = require('ramda')

const { getProjectWeeklyNews } = require('../news')
// const { getLatestTweet } = require('../twitter')
const { getTokenInfo, percentageFormat } = require('../coin')
const { delay } = require('../../helper/common')

moment.locale('zh-cn')

const generateReportData = async projects => {
	let reportData = ''
	for (const item of projects) {
		const data = await requestPeport(item)
		if (data.news) {
			const text = createReport(data)
			// room.say(text)
			console.log(text)
			reportData = `${reportData}\n\n${text}`
		}
	}
	return reportData
}

const requestPeport = async p => {
	try {
		await delay(5000)

		// news
		const news = await getProjectWeeklyNews(p)
		if (news) {
			p['news'] = news.map(n => ({ date: n.date, content: n.lives[0].content }))
		}

		// // tweet
		// const tweet = await getLatestTweet(p)
		// if (tweet) {
		// 	const tweetDate = moment(tweet.created_at)
		// 	if (inDateRange(tweetDate)) {
		// 		p['tweet'] = tweet.text
		// 	}
		// }

		// token info
		if (p.news || p.tweet) {
			// request token
			if (p.token) {
				const tokenInfo = await getTokenInfo(p.token)
				if (tokenInfo) {
					const percent_change_7d = R.path([
						'market_data',
						'price_change_percentage_7d',
					])(tokenInfo)
					// check percentage change abs
					if (Math.abs(percent_change_7d) > 10) {
						p['price_usd'] = R.path(['market_data', 'current_price', 'usd'])(
							tokenInfo,
						)
						p['price_cny'] = R.path(['market_data', 'current_price', 'cny'])(
							tokenInfo,
						)
						p['percent_change_24h'] = R.path([
							'market_data',
							'price_change_percentage_24h',
						])(tokenInfo)
						p['percent_change_7d'] = percent_change_7d
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
	let news = r.news.map(n => `${n.date}：${n.content}`).join('\n')
	// news = `${(news && `动态：\n${news}\n`) || ''}`
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

	return `${title}${news}${price}${percentage_change}`
}

const generateWeeklyReport = async () => {
	// get project list
	const projects = require('../../data/projects.json')
	const report = await generateReportData(projects)

	const now = moment()
	const year = now.year()
	const week = now.week()
	return {
		text: report,
		subject: `${year}年第${week}周投后周报`,
	}
}

module.exports = {
	generateWeeklyReport,
}
