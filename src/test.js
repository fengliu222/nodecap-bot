const { generateReport } = require('./handler/report')
const { generateWeeklyReport } = require('./handler/report/weekly')
const { handleInvestmentQuery } = require('./handler/chat/investment')
const { requestAccessToken, chat, googleChat } = require('./handler/chat')

const {
	requestTokenList,
	getTokenId,
	getTokenInfo,
	formatTokenInfo
} = require('./handler/coin')

// generateReport()
// generateWeeklyReport()
// handleInvestmentQuery('soc')
// const test = async () => {
// 	const info = await chat()
// 	console.log(info)
// }

// test()

googleChat()
