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

netflix.fetchAndPost()

// if (process.env.NODE_ENV === 'development') {
// 	let fiveSec = 5 * 1000
// 	merkato2.fetchAndPost()
// 	moneyExchange.fetchAndPost()
// 	setTimeout(() => {
// 		addisFortune.fetchAndPost()
// 		setTimeout(() => {
// 			netflix.fetchAndPost()
// 			setTimeout(() => {
// 				ethiopianmonitor.fetchAndPost()
// 				setTimeout(() => {
// 					newBusinessEthiopia.fetchAndPost()
// 					setTimeout(() => {
// 						thereportermagazines.fetchAndPost()
// 						setTimeout(() => {
// 							furtherafrica.fetchAndPost()
// 						}, fiveSec)
// 					}, fiveSec)
// 				}, fiveSec)
// 			}, fiveSec)
// 		}, fiveSec)
// 	}, fiveSec)
// }

console.log('servers started ...')
bot.launch()
