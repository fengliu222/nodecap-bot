const requestPromise = require('request-promise')
const R = require('ramda')

const login = async () => {
	try {
		const data = await requestPromise({
			method: 'POST',
			uri: 'https://api.hotnode.cn/v1/users/access-token',
			body: {
				account: 'huangbokang@nodecap.com',
				password: 'gelisha0924',
			},
			json: true,
		})
		if (R.and(!R.isNil(data), !R.isEmpty(data))) {
			global.accessToken = data.access_token
			global.companyId = R.path(['id'])(data.companies[0])
			return Promise.resolve(data)
		}
		return Promise.reject(data)
	} catch (error) {
		return Promise.reject(error)
	}
}

module.exports = {
	login,
}
