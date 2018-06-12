const moment = require('moment-business-time')

const whoGivesSpeechTmr = ({ content }) => {
	if (!/下次谁分享/.test(content)) {
		return
	}

	const team = ['禹涛', 'Maggie', '振阔', '明远', '剑锋', '博康', '朋哥']
	const now = moment()
	const start = moment('06/13/2018', 'MM/DD/YYYY')
	if (now.isBefore(start)) {
		return team[0]
	}
	let diff = now.workingDiff(start, 'days') + 1
	const modulo = () => {
		const modulo = diff % team.length
		if (modulo === team.length) {
			return 0
		}
		return modulo
	}

	let mod = modulo()

	return team[mod]
}

module.exports = {
	whoGivesSpeechTmr,
}
