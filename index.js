require('dotenv').config({
	path: './config.env',
})
const { bot } = require('./bot')

const moneyExchange = require('./RSSWebsites/EthiopianMoneyExchange/ETBExg')
const netflix = require('./RSSWebsites/netflix/netflix')
const thereportermagazines = require('./RSSWebsites/businessEnglish/thereportermagazines/thereportermagazines')
const addisFortune = require('./RSSWebsites/businessEnglish/addisFortune/addisFortune')
const newBusinessEthiopia = require('./RSSWebsites/businessEnglish/newBusinessEthiopia/newBusinessEthiopia')
const furtherafrica = require('./RSSWebsites/businessEnglish/furtherafrica/furtherafrica')
const ethiopianmonitor = require('./RSSWebsites/businessEnglish/ethiopianmonitor/ethiopianmonitor')
const merkato2 = require('./RSSWebsites/businessEnglish/2merkato/2merkato')

let fiveSec = 5 * 1000

bot.command('part1', ctx => {
	setTimeout(() => {
		furtherafrica.fetchAndPost()
		setTimeout(() => {
			thereportermagazines.fetchAndPost()
			setTimeout(() => {
				newBusinessEthiopia.fetchAndPost()
			}, fiveSec)
		}, fiveSec)
	}, fiveSec)
})
bot.command('part2', ctx => {
	setTimeout(() => {
		addisFortune.fetchAndPost()
		setTimeout(() => {
			setTimeout(() => {
				ethiopianmonitor.fetchAndPost()
			}, fiveSec)
		}, fiveSec)
	}, fiveSec)
})
bot.command('part3', ctx => {
	setTimeout(() => {
		merkato2.fetchAndPost()
		setTimeout(() => {
			netflix.fetchAndPost()
		}, fiveSec)
	}, fiveSec)
})
bot.command('money', ctx => {
	moneyExchange.fetchAndPost()
})
const restart = require('./restart')
bot.command('restart', ctx => {
	restart()
})
bot.launch()

// exports.handler = (event, context, callback) => {
// 	const tmp = JSON.parse(event.body) // get data passed to us
// 	bot.handleUpdate(tmp) // make Telegraf process that data
// 	return callback(null, {
// 		// return something for webhook, so it doesn't try to send same stuff again
// 		statusCode: 200,
// 		body: '',
// 	})
// }
