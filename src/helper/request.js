const requestPromise = require('request-promise')

const getBearerToken = async (
	key = 'K1nI8cNIdZ8Ro3U8KftaFLLGe',
	secret = '3gxxFeOizVpkMQlD2hmbkXE8e8N0rXYTQaF3tPJvbsCrlMb2zq'
) => {
	const b64Credentials = Buffer.from(`${key}:${secret}`).toString('base64')
	const { token_type, access_token } = await requestPromise({
		method: 'POST',
		uri: 'https://api.twitter.com/oauth2/token',
		headers: {
			Authorization: `Basic ${b64Credentials}`,
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
		body: 'grant_type=client_credentials',
		json: true
	})
	if (token_type && access_token) {
		return access_token
	}
	return null
}

module.exports = {
	getBearerToken
}
