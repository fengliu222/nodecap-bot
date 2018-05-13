const moment = require('moment')
const { Room } = require('wechaty')
const accounting = require('accounting')
const Raven = require('raven')

const { getProjectWeeklyNews } = require('../news')
// const { getLatestTweet } = require('../twitter')
const { getTokenInfo } = require('../coin')
const { delay, formatPercentage } = require('../../helper/common')

moment.locale('zh-cn')

const generateReportData = async projects => {
	let reportData = []
	for (const item of projects) {
		const data = await requestPeport(item)
		reportData = [...reportData, data]
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
			const tokenInfo = await getTokenInfo(p)
			if (tokenInfo) {
				const {
					price_usd,
					price_cny,
					percent_change_24h,
					percent_change_7d
				} = tokenInfo
				// check percentage change abs
				if (Math.round(percent_change_7h) > 15) {
					p['price_usd'] = price_usd
					p['price_cny'] = price_cny
					p['percent_change_24h'] = percent_change_24h
					p['percent_change_7d'] = percent_change_7d
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
			'￥'
		)}\n`) ||
		''}`
	const percentage_change = `${(r.percent_change_24h &&
		r.percent_change_7d &&
		`涨跌幅：${formatPercentage(
			r.percent_change_24h
		)} (24小时), ${formatPercentage(r.percent_change_7d)} (7天)\n`) ||
		''}`

	return `${title}${news}${price}${percentage_change}`
}

const generateWeeklyReport = async () => {
	const room = await Room.find({ topic: '项目动态-产品设计' })
	if (!room) return

	// get project list
	const projects = require('../../data/projects.json')

	// iterate
	const report_raw = await generateReportData(projects)
	let report_text =
		report_raw
			.filter(r => r.news)
			.map(createReport)
			.join('\n') || '本周暂无项目投后动态-_-'
	report_text = `${moment().year()}年第${moment().week()}周投后周报：\n\n${report_text}`

	// say it
	room.say(report_text)
	// console.log(report_text)
}

module.exports = {
	generateWeeklyReport
}
