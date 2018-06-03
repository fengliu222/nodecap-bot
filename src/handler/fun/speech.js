const moment = require('moment-business-time')

const whoGivesSpeechTmr = ({ content }) => {
	if (!/下次谁分享/.test(content)) {
		return null
	}

	const team = ['明远', '剑锋', '博康', '朋哥', '禹涛', 'Maggie', '振阔']
	const now = moment()
	const start = moment('06/04/2018', 'MM/DD/YYYY')
	if (now.isBefore(start)) {
		return team[0]
	}
	let diff = now.workingDiff(start, 'days')

	const modulo = () => {
		const modulo = diff % team.length
		if (modulo === team.length - 1) {
			return 0
		}
		return modulo + 1
	}

	let mod = modulo()

	return team[mod]
}

module.exports = {
	whoGivesSpeechTmr
}
