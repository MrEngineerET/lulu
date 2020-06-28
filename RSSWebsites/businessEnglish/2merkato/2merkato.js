const fs = require("fs")
const path = require("path")

const Parser = require("rss-parser")
const shortid = require("shortid")

const bot = require("../../../bot")
const siteController = require("./../../Controller/sitesController")

const rssURL = "http://fetchrss.com/rss/5ecc08fa8a93f878358b45675ecc085c8a93f86a2e8b4567.xml"

const latestTitles = path.join(__dirname, "..", "..", "..", "data", "latest.json")
let parser = new Parser()

// button for posts with their own image
let btn = [
	[
		{ text: "#Ethiopian_Business_Daily", callback_data: "post2EBD" },
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
	[
		{
			text: "Contr",
			callback_data: "Contr",
		},
		{
			text: "Covid",
			callback_data: "Covid",
		},
		{
			text: "Fin",
			callback_data: "Fin",
		},
		{
			text: "Tip",
			callback_data: "Tip",
		},
	],
]

let prepareFeeds = function (feeds) {
	return feeds.map((feed) => {
		let imageLocation = ""
		let imageSource = ""
		let start = feed.content.indexOf('src="https:') + 5
		let end = feed.content.indexOf(".jpg")
		if (end == -1) {
			end = feed.content.indexOf(".png")
		}
		if (start == -1 || end == -1) {
			imageLocation = path.join(__dirname, "..", "..", "..", "data", "images", "nopic.jpg")
			imageSource = "local"
		} else {
			end += 4
			imageLocation = feed.content.slice(start, end)
			imageSource = "remote"
		}

		let caption = {
			title: feed.title,
			description: feed.contentSnippet.replace("(Feed generated with FetchRSS)", "").trim(),
			date: feed.pubDate.slice(0, feed.pubDate.indexOf("2020")).trim(),
			to: "toGroup",
			__id: shortid.generate(),
		}
		let data = {
			caption,
			photo: {
				source: imageSource,
				location: imageLocation,
			},
			chatID: process.env.testGroupID,
			buttons: imageSource == "remote" ? btn : btn4noImg,
			sourceURL: feed.link,
		}

		return data
	})
}

exports.fetchAndPost = async function () {
	console.log("2merkato In")
	try {
		let website = "2merkato"
		let titles = JSON.parse(fs.readFileSync(latestTitles, "utf-8"))
		let latestTitle = titles.find((el) => el.website == website).latestTitle
		let newNEWS = []

		let feed = await parser.parseURL(rssURL)

		let items = feed.items.splice(0, 5)

		let latest = true
		for (let i = 0; i < items.length; i++) {
			if (items[i].title != latestTitle) {
				newNEWS.push(items[i])
				if (latest) {
					latestTitle = items[i].title
					latest = false
				}
			} else break
		}

		if (newNEWS.length != 0) {
			let preparedFeeds = prepareFeeds(newNEWS)
			preparedFeeds.forEach((item) => {
				bot.post(item).catch((err) => {
					console.log(err)
				})
			})
			siteController.saveFeeds(preparedFeeds)
		}
		titles = JSON.parse(fs.readFileSync(latestTitles, "utf-8"))
		titles[titles.findIndex((el) => el.website == website)].latestTitle = latestTitle
		fs.writeFileSync(latestTitles, JSON.stringify(titles), "utf-8")
	} catch (err) {
		console.log(err)
	}
}
