const requestPromise = require('request-promise')
const R = require('ramda')

const login = async () => {
	try {
		const data = await requestPromise({
			method: 'POST',
			uri: 'http://47.100.101.130/v1/users/access-token',
			body: {
				account: 'huangbokang@nodecap.com',
				password: 'gelisha0924',
			},
			json: true,
		})
		if (R.and(!R.isNil(data), !R.isEmpty(data))) {
			return Promise.resolve(data.access_token)
		}
		return Promise.reject(data)
	} catch (error) {
		return Promise.reject(error)
	}
}

module.exports = {
	login,
}
