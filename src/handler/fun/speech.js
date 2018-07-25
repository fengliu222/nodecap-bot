const moment = require('moment')
const business = require('moment-business')

const whoGivesSpeechTmr = ({ content }) => {
	if (!/下次谁分享/.test(content)) {
		return
	}

	const team = [
		'Maggie',
		'明远',
		'剑锋',
		'博康',
		'朋哥',
		'禹涛',
		'振阔',
		'苏菲',
		'suyao',
		'张腾',
		'王岩',
	]
	const now = moment()
	const start = moment('07/03/2018', 'MM/DD/YYYY')
	if (now.isBefore(start)) {
		return team[0]
	}
	const bDiff = business.weekDays(start, now)
	const realDiff = now.diff(start, 'day')
	const modulo = () => {
		const modulo = bDiff % team.length
		if (bDiff % 5 === 0) {
			if (realDiff % 7 === 0) {
				return modulo
			}
			return modulo - 1
		}
		if (modulo === team.length - 1) {
			return 0
		}
		return modulo
	}

	return team[modulo()]
}

module.exports = {
	whoGivesSpeechTmr,
}
