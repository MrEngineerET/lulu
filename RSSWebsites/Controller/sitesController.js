const fs = require("fs")
const path = require("path")

const shortid = require("shortid")

const dbJSON = path.join(__dirname, "..", "..", "data", "NEWS.json")

// button for posts with their own image
let btnBusiness = [
	[
		{ text: "#Ethiopian_Business_Daily", callback_data: "post2merkato" },
		{ text: "remove", callback_data: "remove" },
	],
]
// button for posts without their own image
let btn4noImgBusiness = [
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

let btnNetflix = [
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

exports.saveFeeds = function (feeds) {
	data = JSON.parse(fs.readFileSync(dbJSON), "utf-8")
	feeds.forEach((feed) => {
		data.push(feed)
	})
	fs.writeFileSync(dbJSON, JSON.stringify(data), "utf-8", (err) => {
		console.log(err)
	})
}

exports.prepareFeeds = function (feeds, source) {
	return feeds.map((feed) => {
		let imageLocation = ""
		let imageSource = ""
		let start = feed.content.indexOf('src="https:') + 5
		let end = feed.content.indexOf(".jpg")
		if (end == -1) {
			end = feed.content.indexOf(".png")
		}
		if (start == -1 || end == -1) {
			imageLocation = path.join(__dirname, "..", "..", "data", "images", "nopic.jpg")
			imageSource = "local"
		} else {
			end += 4
			imageLocation = feed.content.slice(start, end)
			imageSource = "remote"
		}

		let buttons = imageSource == "remote" ? btnBusiness : btn4noImgBusiness
		let description = feed.content.slice(feed.content.indexOf("</p>") + 4).trim()
		if (source == "netflix") {
			buttons = btnNetflix
		} else if (source == "2merkato") {
			description = feed.contentSnippet.replace("(Feed generated with FetchRSS)", "").trim()
		}

		let caption = {
			title: feed.title,
			description,
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
			buttons,
			sourceURL: feed.link,
		}
		return data
	})
}
