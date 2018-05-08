const moment = require('moment')
const { Room } = require('wechaty')
const accounting = require('accounting')
const Raven = require('raven')

const { getProjectNews } = require('./news')
const { getLatestTweet } = require('./twitter')
const { getTokenInfo } = require('./coin')
const { delay, formatPercentage } = require('../helper/common')

moment.locale('zh-cn')

const generateReportData = async projects => {
	let reportData = []
	for (const item of projects) {
		const data = await requestPeport(item)
		reportData = [...reportData, data]
	}
	return reportData
}

const inDateRange = date => {
	// const targetDate = moment().subtract(3, 'days')
	// return date.isSameOrAfter(targetDate)
	return date.isSame(moment(), 'day')
}

const requestPeport = async p => {
	await delay(5000)
	try {
		// news
		const res = await getProjectNews(p)
		if (res) {
			const { news, date } = res
			// if (inDateRange(moment(date, 'YYYY-MM-DD'))) {
			p['news'] = news.content
			// p['up_counts'] = news.up_counts
			// p['down_counts'] = news.down_counts
			// }
		}

		// tweet
		const tweet = await getLatestTweet(p)
		if (tweet) {
			// if (inDateRange(tweet.created_at)) {
			p['tweet'] = tweet.text
			// }
		}

		// token info
		if (p.news || p.tweet) {
			// request token
			const tokenInfo = await getTokenInfo(p)
			if (tokenInfo) {
				p['price_usd'] = tokenInfo.price_usd
				p['price_cny'] = tokenInfo.price_cny
				p['percent_change_24h'] = tokenInfo.percent_change_24h
				p['percent_change_7d'] = tokenInfo.percent_change_7d
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
			'￥'
		)}\n`) ||
		''}`
	const percentage_change = `${(r.percent_change_24h &&
		r.percent_change_7d &&
		`涨跌幅：${formatPercentage(
			r.percent_change_24h
		)} (24小时), ${formatPercentage(r.percent_change_7d)} (7天)\n`) ||
		''}`
	// const communityFeedback = `${(r.up_counts &&
	// 	r.down_counts &&
	// 	`情绪：${r.up_counts}👍，${r.down_counts}👎\n`) ||
	// 	''}`

	return `${title}${news}${tweet}${price}${percentage_change}`
}

const generateReport = async () => {
	const room = await Room.find({ topic: '项目动态-产品设计' })
	if (!room) return

	// get project list
	const projects = require('../data/projects.json')

	// iterate
	const report_raw = await generateReportData(projects)
	let report_text =
		report_raw
			.filter(r => r.news || r.tweet)
			.map(createReport)
			.join('\n') || '今日暂无项目投后动态-_-'
	report_text = `${moment().format('LL')}投后监测汇总：\n\n${report_text}`

	// say it
	room.say(report_text)
	// console.log(report_text)
}

module.exports = {
	generateReport
}
