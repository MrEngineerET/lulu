const fs = require("fs")
const path = require("path")

const shortid = require("shortid")

const dbJSON = path.join(__dirname, "..", "..", "data", "NEWS.json")

exports.saveFeeds = function (feeds) {
	data = JSON.parse(fs.readFileSync(dbJSON), "utf-8")
	feeds.forEach((feed) => {
		data.push(feed)
	})
	fs.writeFileSync(dbJSON, JSON.stringify(data), "utf-8", (err) => {
		console.log(err)
	})
}

exports.prepareFeeds = function (feeds) {
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
			// buttons: btn,
			sourceURL: feed.link,
		}
		return data
	})
}
