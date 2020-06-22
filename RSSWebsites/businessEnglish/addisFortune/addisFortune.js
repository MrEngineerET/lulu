const fs = require("fs")
const path = require("path")

const shortid = require("shortid")
const Parser = require("rss-parser")

const bot = require("../../../bot")

const rssURL = "https://addisfortune.news/feed/"

const latestItem = path.join(__dirname, "latestAddisFortuneItem.json")
const dbJSON = path.join(__dirname, "addisFortuneNEWS.json")
let remove = "removeAddis"

let parser = new Parser()

// button for posts with their own image
let btn = [
	[
		{ text: "#Ethiopian_Business_Daily", callback_data: "post2merkato" },
		{ text: "remove", callback_data: remove },
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
			callback_data: remove,
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
			imageLocation = path.join(__dirname, "..", "..", "images", "nopic.jpg")
			imageSource = "local"
		} else {
			end += 4
			imageLocation = feed.content.slice(start, end)
			imageSource = "remote"
		}

		let caption = {
			title: feed.title,
			description: feed.content.slice(feed.content.indexOf("</p>") + 4).trim(),
			// date: feed.date,
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

exports.fetchAndPost = async () => {
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
			let preparedFeeds = prepareFeeds(newNewsFeed)
			saveFeeds(preparedFeeds)
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

bot.bot.action(remove, (ctx) => {
	ctx.deleteMessage()
	let caption = ctx.update.callback_query.message.caption
	let id = caption.slice(caption.indexOf("__id") + 5, caption.indexOf("@#$%"))
	deleteDataFromSavedFile(id)
})
bot.bot.action("postAddisFortune", addisFortunePostToChannel)

function addisFortunePostToChannel(ctx) {
	ctx.answerCbQuery()
	let caption = ctx.update.callback_query.message.caption
	let id = caption.slice(caption.indexOf("__id") + 5, caption.indexOf("@#$%"))
	let data = getDataFromSavedFile(id)
	if (data) {
		let photoURL = data.photo.location
		if (data.photo.source == "local") {
			let imgName = ctx.update.callback_query.data
			photoURL = path.join(__dirname, "..", "..", "images", `${imgName}.jpg`)
		}

		data.caption.to = "toChannel"
		data.caption.PhotoURL = photoURL
		data.photo.location = photoURL
		data.chatID = process.env.testChannelID
		bot.post(data).catch((err) => {
			console.log(err)
		})
	}
	ctx.deleteMessage()
}

function saveFeeds(feeds) {
	data = JSON.parse(fs.readFileSync(dbJSON), "utf-8")
	feeds.forEach((feed) => {
		data.push(feed)
	})
	fs.writeFileSync(dbJSON, JSON.stringify(data), "utf-8", (err) => {
		console.log(err)
	})
}

function getDataFromSavedFile(id) {
	let feeds = JSON.parse(fs.readFileSync(dbJSON), "utf-8")
	feed = feeds.find((el) => el.caption.__id == id)
	feeds.splice(feeds.indexOf(feed), 1)
	fs.writeFileSync(dbJSON, JSON.stringify(feeds), "utf-8", (err) => {
		console.log(err)
	})
	return feed
}

function deleteDataFromSavedFile(id) {
	let feeds = JSON.parse(fs.readFileSync(dbJSON), "utf-8")
	feed = feeds.find((el) => el.__id == id)
	feeds.splice(feeds.indexOf(feed), 1)
	fs.writeFileSync(dbJONN, JSON.stringify(feeds), "utf-8", (err) => {
		console.log(err)
	})
}
