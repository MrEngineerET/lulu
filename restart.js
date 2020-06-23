const fs = require("fs")
const path = require("path")

let news = path.join(__dirname, "data", "NEWS.json")
let newsData = JSON.stringify([])
fs.writeFileSync(news, newsData, "utf-8")

let latest = path.join(__dirname, "data", "latest.json")
let latestData = JSON.stringify([
	{
		website: "2merkato",
		latestTitle: " bla bla",
	},
	{
		website: "netflix",
		latestTitle: " bla bla",
	},
	{
		website: "addisFortune",
		latestTitle: " bla bla",
	},
])
fs.writeFileSync(latest, latestData, "utf-8")
