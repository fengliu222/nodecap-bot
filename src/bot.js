// modules
const { handleCoinMsg } = require('./handler/coin')
const { handleInvestmentQuery } = require('./handler/chat/investment')
const { chat } = require('./handler/chat')
const { generateReport } = require('./handler/report')
const { generateWeeklyReport } = require('./handler/report/weekly')
const { whoGivesSpeechTmr } = require('./handler/fun/speech')

const bot = async ({ content, name }) => {
	console.log(name, content)

	const text = content.includes('\n') ? content.split('\n')[1] : content

	// 特殊群逻辑
	if (
		name === '4798305839@chatroom' ||
		name === '6082130353@chatroom' ||
		name === '4726346782@chatroom'
	) {
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
			return res
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
	})
	if (coinMsg) {
		return coinMsg
	}
}

module.exports = {
	bot,
}
