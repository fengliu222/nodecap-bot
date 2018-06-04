var mailer = require('nodemailer')

// Use Smtp Protocol to send Email
var smtpTransport = mailer.createTransport({
	host: 'smtp.exmail.qq.com',
	secure: true, // upgrade later with STARTTLS
	auth: {
		user: 'huangbokang@nodecap.com',
		pass: 'Gelisha0924',
	},
})

var defaultOptions = {
	from: 'huangbokang@nodecap.com',
	to: 'yuxiaofang@nodecap.com',
	cc: [
		'wangmingyuan@nodecap.com',
		'liujianfeng@nodecap.com',
		'liuzhenkuo@nodecap.com',
		'wangpeng@nodecap.com',
		'luyutao@nodecap.com',
	],
}

const mail = (options = {}) => {
	smtpTransport.sendMail(
		{
			...defaultOptions,
			...options,
		},
		function(error, response) {
			if (error) {
				console.log(error)
			} else {
				console.log('Message sent: ' + response.message)
			}

			smtpTransport.close()
		},
	)
}

module.exports = {
	mail,
}
