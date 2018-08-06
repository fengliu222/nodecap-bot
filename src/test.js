const { generateReport } = require('./handler/report')
const { handleInvestmentQuery } = require('./handler/chat/investment')
const { requestAccessToken, chat } = require('./handler/chat')
const { whoGivesSpeechTmr } = require('./handler/fun/speech')
const { bot } = require('./bot')
const { mail } = require('./handler/mail')
const { login } = require('./handler/auth')
const { query: invitationQuery } = require('./handler/other/us_trip')

const {
	requestTokenList,
	getTokenId,
	getTokenInfo,
	formatTokenInfo,
	handleCoinMsg,
} = require('./handler/coin')

// generateReport()
// handleInvestmentQuery('soc')
const test = async () => {
	const { text, subject } = await generateReport()
	console.log(subject, text)
}

test()

// const res = whoGivesSpeechTmr({ content: '下次谁分享' })
// console.log(res)

// const res = invitationQuery('潇芳，bk')
// console.log(res)
