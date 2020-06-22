const fs = require("fs")
const path = require("path")
const shortid = require("shortid")
const Parser = require("rss-parser")

const bot = require("../../../bot")

let parser = new Parser()
const rssURL = "http://fetchrss.com/rss/5ecc08fa8a93f878358b45675ecc085c8a93f86a2e8b4567.xml"

// button for posts with their own image
let btn = [
	[
		{ text: "#Ethiopian_Business_Daily", callback_data: "post2merkato" },
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
	try {
		let latest2MerkatoItem = JSON.parse(
			fs.readFileSync(path.join(__dirname, "latest2merkatoItem.json"), "utf-8")
		)

		let latest2merkatoItemTitle = latest2MerkatoItem.title

		let newNewsFeed = []
		let newLatest2merkatoItem = latest2MerkatoItem

		let feed = await parser.parseURL(rssURL)

		let items = feed.items.splice(0, 5)

		let latest = true
		for (let i = 0; i < items.length; i++) {
			if (items[i].title != latest2merkatoItemTitle) {
				newNewsFeed.push(items[i])
				if (latest) {
					newLatest2merkatoItem = items[i]
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

		fs.writeFileSync(
			path.join(__dirname, "latest2merkatoItem.json"),
			JSON.stringify(newLatest2merkatoItem),
			"utf-8"
		)
	} catch (err) {
		console.log(err)
	}
}
bot.bot.action("post2merkato", merkatoChannelPostController)

bot.bot.action("DNEth", merkatoChannelPostController)
bot.bot.action("EPEth", merkatoChannelPostController)
bot.bot.action("DNInt", merkatoChannelPostController)
bot.bot.action("EPInt", merkatoChannelPostController)
bot.bot.action("NREth", merkatoChannelPostController)
bot.bot.action("NUEth", merkatoChannelPostController)
bot.bot.action("NRInt", merkatoChannelPostController)
bot.bot.action("NUInt", merkatoChannelPostController)
bot.bot.action("BNEth", merkatoChannelPostController)
bot.bot.action("BNInt", merkatoChannelPostController)
bot.bot.action("Evnt", merkatoChannelPostController)
bot.bot.action("Condo", merkatoChannelPostController)
bot.bot.action("Oil", merkatoChannelPostController)
bot.bot.action("Tech", merkatoChannelPostController)
bot.bot.action("Transp", merkatoChannelPostController)
bot.bot.action("Trsm", merkatoChannelPostController)

bot.bot.action("remove", (ctx) => {
	ctx.deleteMessage()
	let caption = ctx.update.callback_query.message.caption
	let id = caption.slice(caption.indexOf("__id") + 5, caption.indexOf("@#$%"))
	deleteDataFromSavedFile(id)
})

function merkatoChannelPostController(ctx) {
	ctx.answerCbQuery()
	let caption = ctx.update.callback_query.message.caption
	let id = caption.slice(caption.indexOf("__id") + 5, caption.indexOf("@#$%"))
	let data = getDataFromSavedFile(id)

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
	ctx.deleteMessage()
}

function saveFeeds(feeds) {
	data = JSON.parse(fs.readFileSync(path.join(__dirname, "2merkatoNEWS.json")), "utf-8")
	feeds.forEach((feed) => {
		data.push(feed)
	})
	fs.writeFileSync(
		path.join(__dirname, "2merkatoNEWS.json"),
		JSON.stringify(data),
		"utf-8",
		(err) => {
			console.log(err)
		}
	)
}

function getDataFromSavedFile(id) {
	let feeds = JSON.parse(fs.readFileSync(path.join(__dirname, "2merkatoNEWS.json")), "utf-8")
	feed = feeds.find((el) => el.caption.__id == id)
	feeds.splice(feeds.indexOf(feed), 1)
	fs.writeFileSync(
		path.join(__dirname, "2merkatoNEWS.json"),
		JSON.stringify(feeds),
		"utf-8",
		(err) => {
			console.log(err)
		}
	)
	return feed
}

function deleteDataFromSavedFile(id) {
	let feeds = JSON.parse(fs.readFileSync(path.join(__dirname, "2merkatoNEWS.json")), "utf-8")
	feed = feeds.find((el) => el.__id == id)
	feeds.splice(feeds.indexOf(feed), 1)
	fs.writeFileSync(
		path.join(__dirname, "2merkatoNEWS.json"),
		JSON.stringify(feeds),
		"utf-8",
		(err) => {
			console.log(err)
		}
	)
}
