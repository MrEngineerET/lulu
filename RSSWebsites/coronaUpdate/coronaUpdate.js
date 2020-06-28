const fs = require("fs")
const path = require("path")

const shortid = require("shortid")
const axios = require("axios")
const bot = require("./../../bot")
const siteController = require("./../Controller/sitesController")

const ethioCoronaUpdateAPI = "https://api.pmo.gov.et/v1/cases/?format=json"

let btn = [
	[
		{
			text: "#Ethiopian_business_daily",
			callback_data: "post2EBD",
		},
		{
			text: "remove",
			callback_data: "remove",
		},
	],
]

function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min)) + min
}
let prepareFeeds = function (feeds) {
	let date = feeds[0].pubDate.slice(0, feeds[0].pubDate.indexOf("2020"))
	let price = feeds.map((element) => {
		let stringPrice = element.contentSnippet.split("=")[1]
		return (1 / (stringPrice.match(/(\d+)/g).join(".") * 1)).toFixed(3)
	})
	let imageLocation = path.join(__dirname, "..", "..", "data", "images", "corona.jpg")
	let imageSource = "local"
	let description = ``
	let today = new Date()
	let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()

	let caption = {
		title: `Today's Ethiopian COVID19 status ${date}`,
		description,
		to: "toGroup",
		date,
		__id: shortid.generate(),
	}

	let data = {
		caption,
		photo: {
			source: imageSource,
			location: imageLocation,
		},
		chatID: process.env.testGroupID,
		buttons: btn,
		sourceURL: "https://api.pmo.gov.et/v1/cases/",
	}
	return data
}

exports.fetchAndPost = async function () {
	let feed = await axios.get(ethioCoronaUpdateAPI)
	console.log(feed)
	let feed = JSON.parse(fs.readFileSync(path.join(__dirname, "./result.json")))
	let items = feed.items

	let neededItem = currenciesShortcut.map((el) => {
		return items.find((item) => item.title.includes(el))
	})
	let preparedFeed = prepareFeeds(neededItem)
	bot.post(preparedFeed).catch((err) => {
		console.log(err)
	})
	siteController.saveFeeds([preparedFeed])
}
