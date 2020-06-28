require("dotenv").config({
	path: "./config.env",
})
const { bot } = require("./bot")

const netflix = require("./RSSWebsites/netflix/netflix")
const moneyExchange = require("./RSSWebsites/EthiopianMoneyExchange/ETBExg")
const thereportermagazines = require("./RSSWebsites/businessEnglish/thereportermagazines/thereportermagazines")
const addisFortune = require("./RSSWebsites/businessEnglish/addisFortune/addisFortune")
const newBusinessEthiopia = require("./RSSWebsites/businessEnglish/newBusinessEthiopia/newBusinessEthiopia")
const furtherafrica = require("./RSSWebsites/businessEnglish/furtherafrica/furtherafrica")
const ethiopianmonitor = require("./RSSWebsites/businessEnglish/ethiopianmonitor/ethiopianmonitor")
const merkato2 = require("./RSSWebsites/businessEnglish/2merkato/2merkato")

if (process.env.NODE_ENV == "production") {
	netflix.fetchAndPost()
	merkato2.fetchAndPost()

	let fiveMinute = 1000 * 60 * 5
	let tenMinute = 1000 * 60 * 10
	let fifteenMinute = 1000 * 60 * 15
	let twentyFiveMinute = 1000 * 60 * 25

	let oneHour = 1000 * 60 * 60 * 1
	let twoHour = 1000 * 60 * 60 * 2
	let threeHour = 1000 * 60 * 60 * 3
	let fourHour = 1000 * 60 * 60 * 4
	let fiveHour = 1000 * 60 * 60 * 5
	let sixHour = 1000 * 60 * 60 * 6
	let twentyFourHour = 1000 * 60 * 60 * 24

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

	function TwentyFourHourFunction() {
		moneyExchange.fetchAndPost()
	}
	setInterval(TwentyFourHourFunction, twentyFourHour + fifteenMinute)
}

if (process.env.NODE_ENV === "development") {
	const oneMinute = 400 * 70 * 1
	const twoMinute = 400 * 60 * 2
	const fourMinute = 400 * 50 * 4

	function oneMinuteFunction() {
		merkato2.fetchAndPost()
		furtherafrica.fetchAndPost()
	}
	setInterval(oneMinuteFunction, oneMinute)

	function twoMinuteFunction() {
		addisFortune.fetchAndPost()
		newBusinessEthiopia.fetchAndPost()
		moneyExchange.fetchAndPost()
	}
	setInterval(twoMinuteFunction, twoMinute)

	function fourMinuteFunction() {
		netflix.fetchAndPost()
		thereportermagazines.fetchAndPost()
		ethiopianmonitor.fetchAndPost()
	}
	setInterval(fourMinuteFunction, fourMinute)
}

bot.launch()
