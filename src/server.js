const Schedule = require('node-schedule')
const Raven = require('raven')
const qrTerm = require('qrcode-terminal')
const { Wechaty, Friendship } = require('wechaty')
const { FileBox } = require('file-box')
const R = require('ramda')

const { bot: replyBot } = require('./bot')
const { mail } = require('./handler/mail')
const { generateReport } = require('./handler/report')
const { generateWeeklyReport } = require('./handler/report/weekly')
const { login } = require('./handler/auth')

const bot = new Wechaty()

Raven.config(
	'https://ec41621ea39d46a2bc8cf0acab3fac43@sentry.io/1199485',
).install()

Schedule.scheduleJob('50 20 * * *', async () => {
	const { text, subject } = await generateReport()
	mail({ text, subject })
})

Schedule.scheduleJob('20 21 * * 7', async () => {
	const { text, subject } = await generateWeeklyReport()
	mail({ text, subject })
})

Schedule.scheduleJob('0 0 * * *', async () => {
	await login()
})

const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min

const handleRoomJoin = async room => {
	const intro =
		'老板好🙇，hotnode是源自Token Fund日常工作需要而衍生的一款企业资管工具，包含了基金收益率实时统计、项目募投管退管理、权限设置、人脉管理等功能。目前产品已经完成了4.0版本，还处于不断迭代之中，还希望老板在使用过程中多给我们提提意见，帮助Hodenode更快成长，更加契合老板在工作中的需求。\n\n此群是咱们Fund的专属群，群内包含了Hotnode的产品经理、工程师、设计师、客户经理，能够7*24随时在线，回答老板在使用过程中可能遇到的各类问题。😄\n\n下图是Hotnode的产品使用手册，里面包含了项目的研发背景、首次启动步骤、各项功能的具体使用方式，望查看。'
	const manual = FileBox.fromFile(`${__dirname}/data/Hotnode产品手册v1.pdf`)
	const download =
		'1、Web端访问地址：http://www.hotnode.io\n2、iOS下载：https://fir.im/hotnode\n3、Android下载：https://fir.im/hotnodeAndroid'

	await room.say(intro)
	await room.say(manual)
	await room.say(download)

	// add other people
	// const squad = await bot.Room.find({ topic: 'Hotnode篮球队' })
	// const current = await room.memberList()
	// const all = await squad.memberList()
	// const diff = R.without(current, all)

	// for (const d of diff) {
	// 	await room.add(d)
	// }
}

let offwork
let onWork
let fruitTime
let extraWork

bot
	.on('scan', (qrcode, status) => {
		qrTerm.generate(qrcode, { small: true }) // show qrcode on console

		const qrcodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
			qrcode,
		)}&size=220x220&margin=20`

		console.log(qrcodeImageUrl)
	})
	.on('login', async user => {
		const workGroup = await bot.Room.find({ topic: '节点小伙伴' })

		onWork = Schedule.scheduleJob('15 09 * * 1-5', async () => {
			await workGroup.say('还有15分钟就要迟到啦，不要忘记打卡哦。')
		})

		fruitTime = Schedule.scheduleJob('00 16 * * 1-5', async () => {
			await workGroup.say('雯华小姐姐，我们的水果咧？')
		})

		offwork = Schedule.scheduleJob('30 18 * * 1-5', async () => {
			await workGroup.say('下班啦，不要忘记打卡哦。')
		})

		extraWork = Schedule.scheduleJob('01 21 * * 1-5', async () => {
			await workGroup.say('要加班的同学，不要忘了提交申请哦。')
		})

		console.log(`${user} login`)
	})
	.on('friendship', async request => {
		if (request.type === Friendship.Type.RECEIVE) {
			await request.accept()
		}
	})
	.on('message', async msg => {
		if (msg.self()) return

		const room = msg.room()
		const contact = msg.from()
		const content = msg.text()

		let name
		if (room) {
			name = await room.topic()
			name = `${contact.name()}：${name}`
		} else {
			name = contact.name()
		}

		// room join
		if (/Hotnode x|x Hotnode/.test(name) && /邀请你加入了群聊/.test(content)) {
			await handleRoomJoin(room)
			return
		}

		const response = await replyBot({ name, content })

		if (response) {
			setTimeout(async () => {
				await msg.say(response)
			}, getRandomArbitrary(0, 3000))
		}
	})
	.on('logout', user => {
		offwork.cancel()
		onWork.cancel()
		fruitTime.cancel()
		extraWork.cancel()
		console.log(`${user} logout`)
	})
	.start()
	.catch(console.error)
