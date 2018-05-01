// const { Room } = require('wechaty')
const { getLatestTweet } = require('./twitter')
const { getTokenInfo } = require('./coin')

const generateReport = async () => {
	// const room = await Room.find({ topic: '节点-产品技术Mafia' })
	// if (!room) return

	// get project list
	const projects = require('../data/projects.json')

	// getLatestTweet(projects[2])
	const prices = projects.forEach(async p => {
		const data = await getTokenInfo(p)
		if (data) {
			console.log(data)
		}
	})
}

module.exports = {
	generateReport
}
