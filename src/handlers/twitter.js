const moment = require('moment')
const Twit = require('twit')
const Translate = require('google-translate')(
	'AIzaSyBI5FkyEUfrao7dcRvFSIUSmHwRST9mUtY'
)
const { Room } = require('wechaty')

moment.locale('zh-cn')

const T = new Twit({
	consumer_key: 'K1nI8cNIdZ8Ro3U8KftaFLLGe',
	consumer_secret: '3gxxFeOizVpkMQlD2hmbkXE8e8N0rXYTQaF3tPJvbsCrlMb2zq',
	access_token: '989762565457641472-YO55h3gUFFggwHaTRrD5zCxnTr0OeXF',
	access_token_secret: 'LWPoGo8OC8D5mTQLtowHpxcFVzCTumBoz7pUgndx8zwNQ',
	timeout_ms: 60 * 1000
})

const handleTwitterRequest = () => {
	T.get('statuses/home_timeline', { count: 10 }, async (err, data, res) => {
		if (!err) {
			const text = data
				.map(
					(t, i) =>
						`${i + 1}\n${moment(t.created_at).format('LLL')}\n${
							t.user.name
						}: \n${t.text}`
				)
				.join('\n\n')
			Translate.translate(text, 'zh-CN', (err, translation) => {
				if (!err) {
					console.log(translation)
				}
			})
			// const room = await Room.find({ topic: '节点-产品技术Mafia' })
			// if (room) {
			// 	await room.say(text)
			// }
		}
	})
}

module.exports = {
	handleTwitterRequest
}
