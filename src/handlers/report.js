const { Room } = require('wechaty')

const generateReport = async () => {
	// const room = await Room.find({ topic: '节点-产品技术Mafia' })
	// if (!room) return

	// get project list
	const projects = require('../data/projects.json')
	console.log(projects)
}

module.exports = {
	generateReport
}
