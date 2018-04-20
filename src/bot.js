const { Wechaty } = require('wechaty')

Wechaty.instance()
	.on('scan', (url, code) =>
		console.log(`Scan QR Code to login: ${code}\n${url}`)
	)
	.on('login', user => console.log(user))
	.on('message', message => console.log(message))
	.start()
