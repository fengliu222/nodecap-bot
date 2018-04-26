const Twit = require('twit')
const { Wechaty } = require('wechaty')

const T = new Twit({
    consumer_key: 'DO95t59LcGDrAg1PEYpk0mwAd',
    consumer_secret: '27pPyOPy8EOr16S8g0U9ZcpsgAyKwcC89MdyIwwGfa7FWaiO0X',
    access_token: '358455402-yg7eh48RQFoG4XHv1jeHRMbfWzIeirDC6rkRYXsd',
    access_token_secret: 'm9nGT4u12CnAPrh1kwdgHQLMdoo6ZQ2sQcX05veHRDBBY',
    timeout_ms: 60 * 1000
})

const handleTwitterRequest = () => {
    T.get('statuses/user_timeline', { screen_name: 'IOStoken' }, (err, data, res) => {
        if (!err) {
            // const tweets = JSON.parse(data)
            const tweetTexts = data.map(t => t.text).join('\n\n')
            // console.log(tweetTexts)
            Wechaty.instance().say(tweetTexts)
        }
    })
}

module.exports = {
    handleTwitterRequest
}
