const delay = ms => new Promise(res => setTimeout(res, ms))
const formatPercentage = p =>
	/-/.test(p) ? `${p.replace('-', '↓ ')}%` : `↑ ${p}%`

module.exports = {
	delay,
	formatPercentage
}
