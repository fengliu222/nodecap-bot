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
				scene_id: 21367711123,
				query: '今天北京天气怎么样?',
				session_id: ''
			},
			headers: {
				'Content-Type': 'application/json',
				charset: 'UTF-8'
			},
			json: true
		})
		console.log(data)
	} catch (error) {}
}

const googleChat = () => {
	// You can find your project ID in your Dialogflow agent settings
	const projectId = 'nodus-bot' //https://dialogflow.com/docs/agents#settings
	const sessionId = 'quickstart-session-id'
	const query = '今天天气怎么样'
	const languageCode = 'zh-CN'

	// Instantiate a DialogFlow client.
	const dialogflow = require('dialogflow')
	const sessionClient = new dialogflow.SessionsClient()

	// Define session path
	const sessionPath = sessionClient.sessionPath(projectId, sessionId)

	// The text query request.
	const request = {
		session: sessionPath,
		queryInput: {
			text: {
				text: query,
				languageCode: languageCode
			}
		}
	}

	// Send request and log result
	sessionClient
		.detectIntent(request)
		.then(responses => {
			console.log('Detected intent')
			const result = responses[0].queryResult
			console.log(`  Query: ${result.queryText}`)
			console.log(`  Response: ${result.fulfillmentText}`)
			if (result.intent) {
				console.log(`  Intent: ${result.intent.displayName}`)
			} else {
				console.log(`  No intent matched.`)
			}
		})
		.catch(err => {
			console.error('ERROR:', err)
		})
}

module.exports = {
	requestAccessToken,
	chat,
	googleChat
}
