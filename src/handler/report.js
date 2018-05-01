// const { Room } = require('wechaty')
const { getLatestTweet } = require('./twitter')
const { getTokenInfo } = require('./coin')

const generateReport = async () => {
	// const room = await Room.find({ topic: '节点-产品技术Mafia' })
	// if (!room) return

	// get project list
	const projects = require('../data/projects.json')

	// iterate
	projects.forEach(async p => {
		// const tokenInfo = await getTokenInfo(p)
		const tweet = await getLatestTweet(p)
		// if (tokenInfo) {
		// 	console.log(tokenInfo)
		// }
		// if (tweet) {
		// 	console.log(tweet)
		// }
	})
}

module.exports = {
	generateReport
}
