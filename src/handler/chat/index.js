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

var session_id

const chat = async message => {
	// get params
	const query = R.trim(message.content)
	try {
		const access_token = await requestAccessToken()
		const { result } = await requestPromise({
			method: 'POST',
			uri: 'https://aip.baidubce.com/rpc/2.0/solution/v1/unit_utterance',
			qs: {
				access_token
			},
			body: {
				scene_id: 21687,
				query,
				session_id
			},
			json: true
		})

		// session_id
		session_id = result.session_id
		const say = R.path(['action_list', 0, 'say'])(result)
		return Promise.resolve(say)
	} catch (e) {
		return Promise.reject(e)
	}
}

module.exports = {
	requestAccessToken,
	chat
}
