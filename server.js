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

if (process.env.NODE_ENV === "development") {
	console.log("development In")

	const oneMinute = 1000 * 60 * 1
	const twoMinute = 1000 * 60 * 2
	const fourMinute = 1000 * 60 * 4

	function oneMinuteFunction() {
		merkato2.fetchAndPost()
	}
	setInterval(oneMinuteFunction, oneMinute)

	function twoMinuteFunction() {
		addisFortune.fetchAndPost()
	}
	setInterval(twoMinuteFunction, twoMinute)

	function fourMinuteFunction() {
		netflix.fetchAndPost()
	}
	setInterval(fourMinuteFunction, fourMinute)
}

bot.launch()
