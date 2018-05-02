const requestPromise = require('request-promise')

const getProjectNews = async project => {
	if (!project.name) return
	try {
		const {
			list: [news]
		} = await requestPromise({
			uri: `https://api.jinse.com/v3/live/list`,
			qs: {
				limit: 1,
				flag: 'down',
				keyword: project.name,
				version: '9.9.9'
			},
			json: true
		})
		if (news) {
			const {
				lives: [item]
			} = news
			return Promise.resolve(item)
		}
		return Promise.reject(news)
	} catch (error) {
		return Promise.reject(error)
	}
}

module.exports = {
	getProjectNews
}
