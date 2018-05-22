const requestPromise = require('request-promise')
const R = require('ramda')
const Raven = require('raven')

const requestAccessToken = async () => {
	try {
		const data = await requestPromise({
			uri: 'https://aip.baidubce.com/oauth/2.0/token',
			qs: {
				grant_type: 'client_credentials',
				client_id: '11I7vwkscVHFDgN2zk5kFhTH',
				client_secret: 'r8kNmE6kdQgOpHDAh85MkGgfWBq2wwjn'
			},
			json: true
		})
		if (R.and(!R.isNil(data), !R.isEmpty(data))) {
			return Promise.resolve(data.access_token)
		}
		return Promise.reject(data)
	} catch (error) {
		return Promise.reject(error)
	}
}

const chat = async () => {
	// get params
	// const content = R.trim(message.content())
	try {
		const access_token = await requestAccessToken()
		const data = await requestPromise({
			method: 'POST',
			uri: 'https://aip.baidubce.com/rpc/2.0/solution/v1/unit_utterance',
			qs: {
				access_token
			},
			body: {
				scene_id: 21687,
				query: '今天北京天气怎么样?',
				session_id: ''
			},
			json: true
		})
		console.log(data)
	} catch (error) {}
}

module.exports = {
	requestAccessToken,
	chat
}
