const moment = require('moment')
const { Room } = require('wechaty')
const accounting = require('accounting')
const Raven = require('raven')

const { getProjectNews } = require('./news')
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

const requestPeport = async p => {
	const project = p
	try {
		await delay(1000)
		const news = await getProjectNews(p)
		if (news) {
			project['news'] = news.content
			project['up_counts'] = news.up_counts
			project['down_counts'] = news.down_counts

			await delay(1000)
			const tokenInfo = await getTokenInfo(p)
			if (tokenInfo) {
				project['price_usd'] = tokenInfo.price_usd
				project['price_cny'] = tokenInfo.price_cny
				project['rank'] = tokenInfo.rank
				project['percent_change_24h'] = tokenInfo.percent_change_24h
				project['percent_change_7d'] = tokenInfo.percent_change_7d
			}
		}
	} catch (e) {
		if (e) {
			Raven.captureException(e)
		}
	}
	return project
}

const createReport = r => {
	const title = `${r.name}${(r.token && ` (${r.token}) `) || ''}：\n\n`
	const news = `${(r.news && `动态：${r.news}\n`) || ''}`
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
	const communityFeedback = `${(r.up_counts &&
		r.down_counts &&
		`情绪：${r.up_counts}👍，${r.down_counts}👎\n`) ||
		''}`

	return `${title}${news}${price}${percentage_change}${communityFeedback}`
}

const generateReport = async () => {
	const room = await Room.find({ topic: '项目动态-产品设计' })
	if (!room) return

	// get project list
	const projects = require('../data/projects.json')

	// iterate
	const report_raw = await generateReportData(projects)
	let report_text = report_raw
		.filter(r => r.news)
		.map(createReport)
		.join('\n')
	report_text = `${moment().format('LL')}投后监测汇总：\n\n${report_text}`

	// say it
	room.say(report_text)
	// console.log(report_text)
}

module.exports = {
	generateReport
}
