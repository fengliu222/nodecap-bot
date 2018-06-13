const { generateReport } = require('./handler/report')
const { generateWeeklyReport } = require('./handler/report/weekly')
const { handleInvestmentQuery } = require('./handler/chat/investment')
const { requestAccessToken, chat } = require('./handler/chat')
const { whoGivesSpeechTmr } = require('./handler/fun/speech')
const { bot } = require('./bot')
const { mail } = require('./handler/mail')
const { login } = require('./handler/auth')

const {
	requestTokenList,
	getTokenId,
	getTokenInfo,
	formatTokenInfo,
} = require('./handler/coin')

// generateReport()
// generateWeeklyReport()
// handleInvestmentQuery('soc')
const test = async () => {
	const data = await bot({ name: 'qq49539772', content: '满币' })
	console.log(data)
}

test()

// const res = whoGivesSpeechTmr({ content: '下次谁分享' })
// console.log(res)
