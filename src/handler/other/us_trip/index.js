const R = require('ramda')
const invitation = require('./us-invitation.json')

const inviter = ['玉梅姐', '范范', '潇芳', '张欢', '玉玲']

const formatOutput = item => {
	const name = `${(!!item['姓名'] && item['姓名']) || ''}`
	const org = `${(!!item['机构'] && `（${item['机构']}）`) || ''}`
	return `${name}${org}`
}

const formatList = list => {
	return list.map(i => formatOutput(i)).join('\n')
}

const uniqueInvitation = (keys = R.keys(invitation)) => {
	const allData = keys.map(i => invitation[i]).filter(d => !R.isNil(d))
	const flat = R.flatten(allData)
	const uniq = R.uniqBy(R.path(['姓名']), flat)
	return uniq
}

const query = text => {
	if (text === 'all') {
		return formatList(uniqueInvitation())
	}

	// basic
	const invitee = invitation[text]
	if (!R.isNil(invitee)) {
		return formatList(invitee)
	}

	// combine
	const inviters = text.split('、')
	if (!R.isNil(inviters)) {
		return formatList(uniqueInvitation(inviters))
	}
	// if (text.split('、'))
}

module.exports = {
	query,
}
