// modules
const { handleCoinMsg } = require('./handler/coin')
const { handleInvestmentQuery } = require('./handler/chat/investment')
const { chat } = require('./handler/chat')
const { generateReport } = require('./handler/report')
const { whoGivesSpeechTmr } = require('./handler/fun/speech')
const { query } = require('./handler/other/us_trip')

const privilegeList = [
	// '4798305839@chatroom',
	// '6082130353@chatroom',
	'项目动态-产品设计',
	'Hotnode篮球队',
	'杨玉梅@Node Capital', // 玉梅姐
	'王明远andy', // 明远
	'Iridescent', // Yutao
	'Kaiyo', // 柯瑶
	'潇芳Ocoa@Node Capital', // 一姐
	'BK', // 我
	'马建军', // 马总
	'陈玉玲', // 玉玲姐,
	'杜均@Node Capital', // 杜总
]

const bot = async ({ content, name }) => {
	console.log(name, content)

	// const text = content.includes('\n') ? content.split('\n')[1] : content

	// US Trip 查询
	// if (name === 'chenyulinghbu' || name === 'a39851352') {
	// 	const res = query(text)
	// 	if (res) {
	// 		return res
	// 	}
	// }

	// if (name === 'qq49539772') {
	// 	// 拓拓
	// 	const res = await handleInvestmentQuery({
	// 		content,
	// 		token: 'UL-oJBk_nksaeEacMSQVgeM-KNt4JQHf', // 郭杰的token,
	// 		company: 2,
	// 	})
	// 	if (res) {
	// 		return res
	// 	}
	// }

	if (/OK|ok|Ok|oK/.test(content)) {
		return
	}

	// 特殊群逻辑
	if (privilegeList.find(p => name.includes(p))) {
		const res = await handleInvestmentQuery({
			content,
		})
		if (res) {
			return res
		}
	}

	// 分享查询逻辑
	if (/Hotnode篮球队/.test(name)) {
		const res = whoGivesSpeechTmr({
			content,
		})
		if (res) {
			return res
		}
	}

	// 币价逻辑
	const coinMsg = await handleCoinMsg({
		content,
	})
	if (coinMsg) {
		return coinMsg
	}
}

module.exports = {
	bot,
}
