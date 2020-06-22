const fs = require("fs")
const path = require("path")

const shortid = require("shortid")
const Parser = require("rss-parser")

const bot = require("../../../bot")
const siteController = require("./../../Controller/sitesController")

const rssURL = "https://addisfortune.news/feed/"

const latestItem = path.join(__dirname, "latestAddisFortuneItem.json")
const dbJSON = path.join(__dirname, "..", "..", "..", "data", "NEWS.json")

let parser = new Parser()

// button for posts with their own image
let btn = [
	[
		{ text: "#Ethiopian_Business_Daily", callback_data: "postAddisFortune" },
		{ text: "remove", callback_data: "remove" },
	],
]
// button for posts without their own image
let btn4noImg = [
	[
		{
			text: "#Ethiopian_Business_daily",
			callback_data: "noResponse",
		},
		{
			text: "Remove",
			callback_data: "remove",
		},
	],
	[
		{
			text: "DNEth",
			callback_data: "DNEth",
		},
		{
			text: "EPEth",
			callback_data: "EPEth",
		},
		{
			text: "DNInt",
			callback_data: "DNInt",
		},
		{
			text: "EPInt",
			callback_data: "EPInt",
		},
	],
	[
		{
			text: "NREth",
			callback_data: "NREth",
		},
		{
			text: "NUEth",
			callback_data: "NUEth",
		},
		{
			text: "NRInt",
			callback_data: "NRInt",
		},
		{
			text: "NUInt",
			callback_data: "NUInt",
		},
	],
	[
		{
			text: "BNEth",
			callback_data: "BNEth",
		},
		{
			text: "BNInt",
			callback_data: "BNInt",
		},
		{
			text: "Evnt",
			callback_data: "Evnt",
		},
		{
			text: "Condo",
			callback_data: "Condo",
		},
	],
	[
		{
			text: "Oil",
			callback_data: "Oil",
		},
		{
			text: "Tech",
			callback_data: "Tech",
		},
		{
			text: "Transp",
			callback_data: "Transp",
		},
		{
			text: "Trsm",
			callback_data: "Trsm",
		},
	],
]

exports.fetchAndPost = async () => {
	console.log("addis fortune In")
	try {
		let latestNetflixItem = JSON.parse(fs.readFileSync(latestItem, "utf-8"))
		let latestNetflixItemTitle = latestNetflixItem.title

		let newNewsFeed = []
		let newLatestNetflixItem = latestNetflixItem

		let feed = await parser.parseURL(rssURL)

		let items = feed.items.splice(0, 5)

		let latest = true
		for (let i = 0; i < items.length; i++) {
			if (items[i].title != latestNetflixItemTitle) {
				newNewsFeed.push(items[i])
				if (latest) {
					newLatestNetflixItem = items[i]
					latest = false
				}
			} else {
				break
			}
		}

		if (newNewsFeed.length != 0) {
			let preparedFeeds = siteController.prepareFeeds(newNewsFeed)
			siteController.saveFeeds(preparedFeeds)
			preparedFeeds.forEach((item) => {
				bot.post(item).catch((err) => {
					console.log(err)
				})
			})
		}

		fs.writeFileSync(latestItem, JSON.stringify(newLatestNetflixItem), "utf-8")
	} catch (err) {
		console.log(err)
	}
}
