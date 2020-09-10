require('dotenv').config({
	path: './config.env',
})
const { bot } = require('./bot')

const netflix = require('./RSSWebsites/netflix/netflix')
const thereportermagazines = require('./RSSWebsites/businessEnglish/thereportermagazines/thereportermagazines')
const addisFortune = require('./RSSWebsites/businessEnglish/addisFortune/addisFortune')
const newBusinessEthiopia = require('./RSSWebsites/businessEnglish/newBusinessEthiopia/newBusinessEthiopia')
const furtherafrica = require('./RSSWebsites/businessEnglish/furtherafrica/furtherafrica')
const ethiopianmonitor = require('./RSSWebsites/businessEnglish/ethiopianmonitor/ethiopianmonitor')
const merkato2 = require('./RSSWebsites/businessEnglish/2merkato/2merkato')
const moneyExchange = require('./RSSWebsites/EthiopianMoneyExchange/ETBExg')

require('./restart')()

const oneMinute = 1000 * 60
setTimeout(() => {
	merkato2.fetchAndPost()
	setTimeout(() => {
		netflix.fetchAndPost()
		setTimeout(() => {
			thereportermagazines.fetchAndPost()
			setTimeout(() => {
				newBusinessEthiopia.fetchAndPost()
				setTimeout(() => {
					moneyExchange.fetchAndPost()
					setTimeout(() => {
						ethiopianmonitor.fetchAndPost()
						setTimeout(() => {
							addisFortune.fetchAndPost()
							setTimeout(() => {
								furtherafrica.fetchAndPost()
							}, oneMinute)
						}, oneMinute)
					}, oneMinute)
				}, oneMinute)
			}, oneMinute)
		}, oneMinute)
	}, oneMinute)
}, oneMinute)

let fiveMinute = 1000 * 60 * 5
let tenMinute = 1000 * 60 * 10
let fifteenMinute = 1000 * 60 * 15
let twentyFiveMinute = 1000 * 60 * 25

let oneHour = 1000 * 60 * 60 * 1
let twoHour = oneHour * 2
let threeHour = oneHour * 3
let fourHour = twoHour * 2
let fiveHour = oneHour * 5
let sixHour = threeHour * 2
let twelveHour = sixHour * 2

function oneHourFunction() {
	netflix.fetchAndPost()
	thereportermagazines.fetchAndPost()
}
setInterval(oneHourFunction, oneHour + twentyFiveMinute)

function twoHourFunction() {
	addisFortune.fetchAndPost()
}
setInterval(twoHourFunction, twoHour + tenMinute)

function threeHourFunction() {
	ethiopianmonitor.fetchAndPost()
}
setInterval(threeHourFunction, threeHour + fiveMinute)

function fourHourFunction() {
	furtherafrica.fetchAndPost()
}
setInterval(fourHourFunction, fourHour + twentyFiveMinute)

function fiveHourFunction() {
	newBusinessEthiopia.fetchAndPost()
}
setInterval(fiveHourFunction, fiveHour + tenMinute)

function sixHourFunction() {
	merkato2.fetchAndPost()
}
setInterval(sixHourFunction, sixHour + fifteenMinute)

function twelveHourFunction() {
	moneyExchange.fetchAndPost()
}
setInterval(sixHourFunction, twelveHour + fifteenMinute)

let thirtySec = 30 * 1000

bot.command('part1', ctx => {
	setTimeout(() => {
		furtherafrica.fetchAndPost()
		setTimeout(() => {
			thereportermagazines.fetchAndPost()
			setTimeout(() => {
				newBusinessEthiopia.fetchAndPost()
			}, thirtySec)
		}, thirtySec)
	}, thirtySec)
})
bot.command('part2', ctx => {
	setTimeout(() => {
		addisFortune.fetchAndPost()
		setTimeout(() => {
			setTimeout(() => {
				ethiopianmonitor.fetchAndPost()
			}, thirtySec)
		}, thirtySec)
	}, thirtySec)
})
bot.command('part3', ctx => {
	setTimeout(() => {
		merkato2.fetchAndPost()
		setTimeout(() => {
			netflix.fetchAndPost()
		}, thirtySec)
	}, thirtySec)
})
bot.command('money', ctx => {
	moneyExchange.fetchAndPost()
})

bot.command('restart', ctx => {
	require('./restart')()
})

bot.launch()
