// modules
const { handleCoinMsg } = require('./handler/coin')
const { handleInvestmentQuery } = require('./handler/chat/investment')
const { chat } = require('./handler/chat')
const { generateReport } = require('./handler/report')
const { generateWeeklyReport } = require('./handler/report/weekly')
const { whoGivesSpeechTmr } = require('./handler/fun/speech')
const { query } = require('./handler/other/us_trip')

const privilegeList = [
	'4798305839@chatroom',
	'6082130353@chatroom',
	'4726346782@chatroom',
	// '5087001594@chatroom',
	'wxid_v6615c0nvmci41', // 玉梅姐
	'randyking123', // 明远
	'wxid_wktnw3oay78b11', // Yutao
	'a39851352', // 我
	'majianjun', // 马总
	'chenyulinghbu', // 玉玲姐,
	'lvxing', // 杜总
]

const bot = async ({ content, name }) => {
	console.log(name, content)

	const text = content.includes('\n') ? content.split('\n')[1] : content

	// US Trip 查询
	if (name === 'chenyulinghbu' || name === 'a39851352') {
		const res = query(text)
		if (res) {
			return res
		}
	}

	if (name === 'qq49539772') {
		// 拓拓
		const res = await handleInvestmentQuery({
			content: text,
			token: 'UL-oJBk_nksaeEacMSQVgeM-KNt4JQHf', // 郭杰的token,
			company: 2,
		})
		if (res) {
			return res
		}
	}

	// 特殊群逻辑
	if (privilegeList.includes(name)) {
		const res = await handleInvestmentQuery({
			content: text,
		})
		if (res) {
			return res
		}
	}

	// 分享查询逻辑
	if (name === '4910196791@chatroom') {
		const res = whoGivesSpeechTmr({
			content: text,
		})
		if (res) {
			return '王明远'
		}
	}

	// if (/你好/.test(content)) {
	// 	message.say('雷猴，我是币猴')
	// }

	// if (/图样|图森破/.test(content)) {
	// 	message.say('Sometimes Naïve')
	// }

	// if (/华莱士/.test(content)) {
	// 	message.say('不知道高到哪里去了')
	// }

	// if (/苟利国家生死以/.test(content)) {
	// 	message.say('岂因祸福避趋之')
	// }

	// if (/香港记者/.test(content)) {
	// 	message.say('跑得快')
	// }

	// if (/西方/.test(content)) {
	// 	message.say('哪个国家我没去过')
	// }

	// if (/水至清则无鱼/.test(content)) {
	// 	message.say('人至贱则无敌')
	// }

	// 币价逻辑
	const coinMsg = await handleCoinMsg({
		content: text,
		inEnglish: name === '12473034963@chatroom',
	})
	if (coinMsg) {
		return coinMsg
	}
}

module.exports = {
	bot,
}
