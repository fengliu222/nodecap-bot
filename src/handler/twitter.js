const requestPromise = require('request-promise')
const querystring = require('querystring')
const { getBearerToken } = require('../helper/request')

var bearerToken
const getLatestTweet = async project => {
	if (!project.twitter) return
	if (!bearerToken) {
		bearerToken = await getBearerToken()
	}
	// get lasted tweet
	const [data] = await requestPromise({
		uri: 'https://api.twitter.com/1.1/statuses/user_timeline',
		qs: {
			screen_name: project.twitter,
			count: 1
		},
		headers: {
			Authorization: `Bearer ${bearerToken}`
		},
		json: true
	})
	// translate the tweet
	if (data.text) {
		const {
			data: {
				translations: [translation]
			}
		} = await requestPromise({
			method: 'POST',
			uri: 'https://translation.googleapis.com/language/translate/v2',
			form: querystring.stringify({
				q: data.text,
				target: 'zh-CN',
				key: 'AIzaSyBI5FkyEUfrao7dcRvFSIUSmHwRST9mUtY'
			}),
			json: true
		})
		if (translation) return translation.translatedText
	}
	return null
}

module.exports = {
	// handleTwitterRequest,
	getLatestTweet
}
