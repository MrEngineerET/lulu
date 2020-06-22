const fs = require("fs")
const path = require("path")

let latestData = JSON.stringify({
	title: "title",
})

let newsData = JSON.stringify([])

let letestMerkato = path.join(
	__dirname,
	"RSSWebsites",
	"businessEnglish",
	"2merkato",
	"latest2merkatoItem.json"
)
let latestNetflix = path.join(__dirname, "RSSWebsites", "netflix", "latestNetflixItem.json")

let latestAddisFortune = path.join(
	__dirname,
	"RSSWebsites",
	"businessEnglish",
	"addisFortune",
	"latestAddisFortuneItem.json"
)

news = path.join(__dirname, "data", "NEWS.json")

fs.writeFileSync(letestMerkato, latestData, "utf-8")
fs.writeFileSync(latestAddisFortune, latestData, "utf-8")
fs.writeFileSync(latestNetflix, latestData, "utf-8")

fs.writeFileSync(news, newsData, "utf-8")
