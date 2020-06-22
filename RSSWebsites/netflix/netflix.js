const fs = require("fs")
const path = require("path")

const Parser = require("rss-parser")
const shortid = require("shortid")

const bot = require("./../../bot")

const rssURL = "https://www.whats-on-netflix.com/feed/"

const latestItem = path.join(__dirname, "latestNetflixItem.json")
const dbJSON = path.join(__dirname, "netflixNEWS.json")

let parser = new Parser()

let btn = [
	[
		{
			text: "#Netflix_Addis",
			callback_data: "postNetflix",
		},
		{
			text: "remove",
			callback_data: "remove",
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
			// buttons: imageSource == "remote" ? btn : btn4noImg,
			buttons: btn,
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

function saveFeeds(feeds) {
	data = JSON.parse(fs.readFileSync(dbJSON), "utf-8")
	feeds.forEach((feed) => {
		data.push(feed)
	})
	fs.writeFileSync(dbJSON, JSON.stringify(data), "utf-8", (err) => {
		console.log(err)
	})
}
// bot.bot.action("postNetflix", netflixPostToChannel)
// function netflixPostToChannel(ctx) {
// 	ctx.answerCbQuery()
// 	let caption = ctx.update.callback_query.message.caption
// 	let id = caption.slice(caption.indexOf("__id") + 5, caption.indexOf("@#$%"))
// 	let data = getDataFromSavedFile(id)
// 	if (data) {
// 		let photoURL = data.photo.location
// 		if (data.photo.source == "local") {
// 			let imgName = ctx.update.callback_query.data
// 			photoURL = path.join(__dirname, "..", "..", "images", `${imgName}.jpg`)
// 		}

// 		data.caption.to = "toChannel"
// 		data.caption.PhotoURL = photoURL
// 		data.photo.location = photoURL
// 		data.chatID = process.env.testChannelID
// 		bot.post(data).catch((err) => {
// 			console.log(err)
// 		})
// 	}
// 	ctx.deleteMessage()
// }

// function getDataFromSavedFile(id) {
// 	let feeds = JSON.parse(fs.readFileSync(dbJSON), "utf-8")
// 	feed = feeds.find((el) => el.caption.__id == id)
// 	feeds.splice(feeds.indexOf(feed), 1)
// 	fs.writeFileSync(dbJSON, JSON.stringify(feeds), "utf-8", (err) => {
// 		console.log(err)
// 	})
// 	return feed
// }

// function deleteDataFromSavedFile(id) {
// 	let feeds = JSON.parse(fs.readFileSync(dbJSON), "utf-8")
// 	feed = feeds.find((el) => el.__id == id)
// 	feeds.splice(feeds.indexOf(feed), 1)
// 	fs.writeFileSync(dbJSON, JSON.stringify(feeds), "utf-8", (err) => {
// 		console.log(err)
// 	})
// }
