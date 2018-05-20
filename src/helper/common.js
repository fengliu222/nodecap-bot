const delay = ms => new Promise(res => setTimeout(res, ms))
const formatPercentage = p => {
	return `${/-/.test(p) ? '↓' : '↑'} ${p}%`
}

module.exports = {
	delay,
	formatPercentage
}
