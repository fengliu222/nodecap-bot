const { generateReport } = require('./handler/report')
const { generateWeeklyReport } = require('./handler/report/weekly')
const { handleInvestmentQuery } = require('./handler/chat/investment')
const { requestAccessToken, chat } = require('./handler/chat')
const { whoGivesSpeechTmr } = require('./handler/fun/speech')
const { bot } = require('./bot')

const {
	requestTokenList,
	getTokenId,
	getTokenInfo,
	formatTokenInfo
} = require('./handler/coin')

// generateReport()
// generateWeeklyReport()
// handleInvestmentQuery('soc')
const test = async () => {
	const info = await bot({ content: '下次谁分享', name: '4910196791@chatroom' })
	console.log(info)
}

test()

// const res = whoGivesSpeechTmr({ content: '下次谁分享' })
// console.log(res)
