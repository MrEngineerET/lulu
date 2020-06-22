require("dotenv").config({
	path: "./config.env",
})
const { bot } = require("./bot")

const netflix = require("./RSSWebsites/netflix/netflix")
const merkato2 = require("./RSSWebsites/businessEnglish/2merkato/2merkato")
const addisFortune = require("./RSSWebsites/businessEnglish/addisFortune/addisFortune")

// if (process.env.NODE_ENV == "production") {
// 	netflix.fetchAndPost()
// 	merkato2.fetchAndPost()

// 	let twoHour = 1000 * 60 * 60 * 2

// 	function twoHourFunction() {
// 		netflix.fetchAndPost()
// 	}
// 	setInterval(twoHourFunction, twoHour)

// 	let sixHour = 1000 * 60 * 60 * 6

// 	function sixHourFunction() {
// 		merkato2.fetchAndPost()
// 	}

// 	setInterval(sixHourFunction, sixHour)
// }

// if (process.env.NODE_ENV === "development") {
// 	const thirtySeconds = 1000 * 10 * 3
// 	const oneMinute = 1000 * 10 * 6

// 	function thirtySecondFunction() {
// 		netflix.fetchAndPost()
// 	}
// 	setInterval(thirtySecondFunction, thirtySeconds)

// 	function oneMinuteFunction() {
// 		merkato2.fetchAndPost()
// 	}
// 	setInterval(oneMinuteFunction, oneMinute)
// }

// merkato2.fetchAndPost()
// netflix.fetchAndPost()
addisFortune.fetchAndPost()

bot.launch()
