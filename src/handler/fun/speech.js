const moment = require('moment')
const business = require('moment-business')

const whoGivesSpeechTmr = ({ content }) => {
	if (!/下次谁分享/.test(content)) {
		return
	}

	const team = [
		'张腾',
		'王岩',
		'玉坤',
		'Maggie',
		'明远',
		'剑锋',
		'博康',
		'朋哥',
		'振阔',
		'suyao',
		'苏菲',
	]
	const daysToNow = content.match(/下/g).length - 1
	const anchor = moment().add(daysToNow, 'day')
	const start = moment('08/20/2018', 'MM/DD/YYYY')
	if (anchor.isBefore(start)) {
		return team[0]
	}
	const bDiff = business.weekDays(start, anchor)
	const realDiff = anchor.diff(start, 'day')
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
