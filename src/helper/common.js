const delay = ms => new Promise(res => setTimeout(res, ms))
const formatPercentage = p => {
	if (p) {
		return /-/.test(p) ? `${p.replace('-', '↓ ')}%` : `↑ ${p}%`
	}
	return null
}

module.exports = {
	delay,
	formatPercentage
}
