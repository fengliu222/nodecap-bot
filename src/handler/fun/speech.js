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
	]
	const now = moment()
	const start = moment('07/02/2018', 'MM/DD/YYYY')
	if (now.isBefore(start)) {
		return team[0]
	}
	// let diff = now.workingDiff(start, 'days') + 1
	const diff = business.weekDays(start, now)
	const modulo = () => {
		const modulo = diff % team.length
		if (modulo === team.length) {
			return 0
		}
		return modulo + 1
	}

	return team[modulo()]
}

module.exports = {
	whoGivesSpeechTmr,
}
