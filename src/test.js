const { generateReport } = require('./handler/report')
const { generateWeeklyReport } = require('./handler/report/weekly')
const { handleInvestmentQuery } = require('./handler/chat/investment')
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
	const info = await handleInvestmentQuery('潇芳')
	console.log(info)
}

test()
