const requestPromise = require('request-promise')
const querystring = require('querystring')
const { getBearerToken } = require('../helper/request')

var bearerToken
const getLatestTweet = async project => {
	if (!project.twitter) return
	try {
		if (!bearerToken) {
			bearerToken = await getBearerToken()
		}
		// get latest tweet
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
		if (data) {
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
					key: 'AIzaSyD85qBkruhjdsS37PMnyeVns9Jbtan_kGs'
				}),
				json: true
			})
			if (translation) {
				data.text = translation.translatedText
			}
			return Promise.resolve(data)
		}
		return Promise.reject(data)
	} catch (error) {
		return Promise.reject(error)
	}
}

module.exports = {
	getLatestTweet
}
