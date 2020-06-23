require("dotenv").config({
	path: "./config.env",
})
const { bot } = require("./bot")

const netflix = require("./RSSWebsites/netflix/netflix")
const merkato2 = require("./RSSWebsites/businessEnglish/2merkato/2merkato")
const addisFortune = require("./RSSWebsites/businessEnglish/addisFortune/addisFortune")
const newBusinessEthiopia = require("./RSSWebsites/businessEnglish/newBusinessEthiopia/newBusinessEthiopia")
const thereportermagazines = require("./RSSWebsites/businessEnglish/thereportermagazines/thereportermagazines")

if (process.env.NODE_ENV == "production") {
	netflix.fetchAndPost()
	merkato2.fetchAndPost()

	let tenMinute = 1000 * 60 * 10
	let fifteenMinute = 1000 * 60 * 15
	let twentyFiveMinute = 1000 * 60 * 25

	let oneHour = 1000 * 60 * 60 * 1
	let twoHour = 1000 * 60 * 60 * 2
	let sixHour = 1000 * 60 * 60 * 6

	function oneHourFunction() {
		netflix.fetchAndPost()
		thereportermagazines.fetchAndPost()
	}
	setInterval(oneHourFunction, oneHour + twentyFiveMinute)

	function twoHourFunction() {
		addisFortune.fetchAndPost()
		newBusinessEthiopia.fetchAndPost()
	}
	setInterval(twoHourFunction, twoHour + tenMinute)

	function sixHourFunction() {
		merkato2.fetchAndPost()
	}
	setInterval(sixHourFunction, sixHour + fifteenMinute)
}

// if (process.env.NODE_ENV === "development") {
// 	console.log("development In")

// 	const oneMinute = 400 * 70 * 1
// 	const twoMinute = 400 * 60 * 2
// 	const fourMinute = 400 * 50 * 4

// 	function oneMinuteFunction() {
// 		merkato2.fetchAndPost()
// 	}
// 	setInterval(oneMinuteFunction, oneMinute)

// 	function twoMinuteFunction() {
// 		addisFortune.fetchAndPost()
// 		newBusinessEthiopia.fetchAndPost()
// 	}
// 	setInterval(twoMinuteFunction, twoMinute)

// 	function fourMinuteFunction() {
// 		netflix.fetchAndPost()
// 		thereportermagazines.fetchAndPost()
// 	}
// 	setInterval(fourMinuteFunction, fourMinute)
// }

newBusinessEthiopia.fetchAndPost()
thereportermagazines.fetchAndPost()
bot.launch()
