const moment = require('moment')
const { Room } = require('wechaty')
const accounting = require('accounting')

const { getProjectNews } = require('./news')
const { getTokenInfo } = require('./coin')
const { delay } = require('../helper/common')

moment.locale('zh-cn')

const generateReport = async () => {
	const room = await Room.find({ topic: '节点-产品技术Mafia' })
	if (!room) return

	// get project list
	const projects = require('../data/projects.json')

	// iterate
	const report_raw = await Promise.all(
		projects.map(async p => {
			const project = p
			try {
				const news = await getProjectNews(p)
				project['news'] = news.content
			} catch (error) {
				console.error(error)
			}
			try {
				const tokenInfo = await getTokenInfo(p)
				project['price_usd'] = tokenInfo.price_usd
				project['price_cny'] = tokenInfo.price_cny
			} catch (error) {
				console.error(error)
			}
			return project
		})
	)
	let report_text = report_raw
		.filter(r => r.news || r.price_cny || r.price_usd)
		.map(r => {
			return `${r.name}${r.token ? `（${r.token}）` : ''}：\n${
				r.news ? `动态：${r.news}\n` : ''
			}${
				r.price_usd || r.price_cny
					? `价格：${accounting.formatMoney(
							r.price_usd
					  )}/${accounting.formatMoney(r.price_cny, '￥')}`
					: ''
			}`
		})
		.join('\n\n')
	report_text = `节点投资项目动态汇总(${moment().format(
		'L'
	)})：\n\n${report_text}`

	// say it
	room.say(report_text)
	// console.log(report_text)
}

module.exports = {
	generateReport
}
