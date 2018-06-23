const R = require('ramda')
const invitation = require('./us-invitation.json')

const formatOutput = item => {
	const name = `${(!!item['姓名'] && item['姓名']) || ''}`
	const org = `${(!!item['机构'] && `（${item['机构']}）`) || ''}`
	return `${name}${org}`
}

const formatList = list => {
	const l = list.map(i => formatOutput(i)).filter(i => !R.isEmpty(i))
	if (R.isEmpty(l)) {
		return
	}
	return l.join('\n')
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
	let response

	if (text === 'all') {
		response = formatList(unionInvitation())
	}

	// basic
	const invitee = invitation[text]
	if (!R.isNil(invitee)) {
		response = formatList(invitee)
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
		response = formatList(unionInvitation(inviters))
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
		response = formatList(intersectInvitation(inviterData))
	}

	if (response) {
		return `美国活动邀请名单查询：\n\n${response}\n\n（此功能属 niuniu_dreammaker 独享）`
	}

	return
}

module.exports = {
	query,
}
