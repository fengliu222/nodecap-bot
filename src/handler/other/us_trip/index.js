const R = require('ramda')
const invitation = require('./us-invitation.json')

const formatOutput = item => {
	const name = `${(!!item['姓名'] && item['姓名']) || ''}`
	const org = `${(!!item['机构'] && `（${item['机构']}）`) || ''}`
	return `${name}${org}`
}

const formatList = list => {
	return list.map(i => formatOutput(i)).join('\n')
}

const unionInvitation = (keys = R.keys(invitation)) => {
	const allData = keys.map(i => invitation[i]).filter(d => !R.isNil(d))
	const flat = R.flatten(allData)
	const uniq = R.uniqBy(R.path(['姓名']), flat)
	return uniq
}

const intersectInvitation = (keys = R.keys(invitation)) => {
	const allData = keys.map(i => invitation[i]).filter(d => !R.isNil(d))
	const intersection = allData.reduce((a, d) => {
		const byName = R.eqBy(R.prop('姓名'))
		return R.innerJoin(byName, a, d)
	})
	return intersection
}

const query = text => {
	if (text === 'all') {
		return formatList(unionInvitation())
	}

	// basic
	const invitee = invitation[text]
	if (!R.isNil(invitee)) {
		return formatList(invitee)
	}

	// combine
	const inviters = text.split('、')
	if (
		!R.isNil(inviters) &&
		R.equals(
			R.union(R.keys(invitation), inviters).length,
			R.keys(invitation).length,
		)
	) {
		return formatList(unionInvitation(inviters))
	}

	// interest
	const inviterData = text.split('，')
	if (
		!R.isNil(inviterData) &&
		R.equals(
			R.union(R.keys(invitation), inviterData).length,
			R.keys(invitation).length,
		)
	) {
		return formatList(intersectInvitation(inviterData))
	}

	return
}

module.exports = {
	query,
}
