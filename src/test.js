const { generateReport } = require('./handler/report')
const { generateWeeklyReport } = require('./handler/report/weekly')
const { handleInvestmentQuery } = require('./handler/chat/investment')
const { requestAccessToken, chat } = require('./handler/chat')

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
	const info = await getTokenInfo('nkn')
	console.log(formatTokenInfo(info))
}

test()
