const Twit = require('twit')
const { Wechaty } = require('wechaty')

const T = new Twit({
	consumer_key: 'K1nI8cNIdZ8Ro3U8KftaFLLGe',
	consumer_secret: '3gxxFeOizVpkMQlD2hmbkXE8e8N0rXYTQaF3tPJvbsCrlMb2zq',
	access_token: '989762565457641472-YO55h3gUFFggwHaTRrD5zCxnTr0OeXF',
	access_token_secret: 'LWPoGo8OC8D5mTQLtowHpxcFVzCTumBoz7pUgndx8zwNQ',
	timeout_ms: 60 * 1000
})

const handleTwitterRequest = () => {
	T.get('statuses/home_timeline', { count: 20 }, (err, data, res) => {
		if (!err) {
			const text = data.map(t => `${t.user.name}:\n${t.text}`).join('\n\n')
			Wechaty.instance().say(text)
		}
	})
}

module.exports = {
	handleTwitterRequest
}
