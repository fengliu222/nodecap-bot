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

const handleTwitterRequest = async () => {
	const room = await Room.find({ topic: '节点-产品技术Mafia' })
	if (!room) return
	T.get('statuses/home_timeline', { count: 20 }, (err, data, res) => {
		if (err) return
		const content = data.map(d => d.text)
		Translate.translate(content, 'zh-CN', (err, translation) => {
			if (err) return
			let combinedText = data.map((d, i) => {
				const { translatedText } = translation[i]
				return `${i + 1}. ${d.user.name}（${moment(d.created_at).format(
					'LT'
				)}）：\n${translatedText}\n\n`
			})
			combinedText = `节点投资项目动态汇总（${moment().format(
				'L'
			)}）：\n\n${combinedText}`

			// send it
			room.say(combinedText)
		})
	})
}

module.exports = {
	handleTwitterRequest
}
