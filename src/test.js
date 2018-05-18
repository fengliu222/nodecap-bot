const { generateReport } = require('./handler/report')
const { generateWeeklyReport } = require('./handler/report/weekly')
const { handleInvestmentQuery } = require('./handler/chat/investment')
const { requestTokenList, getTokenId, getTokenInfo } = require('./handler/coin')

// generateReport()
// generateWeeklyReport()
// handleInvestmentQuery()
const test = async () => {
	const info = await getTokenInfo('ppt')
	console.log(info)
}

test()
