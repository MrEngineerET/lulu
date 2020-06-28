const fs = require("fs")
const path = require("path")

const Parser = require("rss-parser")
const shortid = require("shortid")

const bot = require("./../../bot")
const siteController = require("./../Controller/sitesController")

const rssURL = "https://etb.fxexchangerate.com/rss.xml"

let parser = new Parser()
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

let currenciesShortcut = [
	"USD",
	"GBP",
	"EUR",
	"CAD",
	"AUD",
	"CNY",
	"SAR",
	"AED",
	"JPY",
	"DJF",
	"KES",
	"INR",
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
	let imageChoice = randomNum(1, 4)
	let imageLocation = path.join(
		__dirname,
		"..",
		"..",
		"data",
		"images",
		`exchange${imageChoice}.jpg`
	)
	let imageSource = "local"
	let description = `
   Currency             		 ETB 🇪🇹
🇺🇸	USD		---------------   ${price[0]} 
🏴󠁧󠁢󠁥󠁮󠁧	GBG		---------------   ${price[1]}                            
🇪🇺	EUR		---------------   ${price[2]}               
🇨🇦	CAD		---------------   ${price[3]}   
🇦🇺	AUD		---------------   ${price[4]}      
🇨🇳	CNY		---------------   ${price[5]}   
🇸🇦	SAR		 ---------------   ${price[6]}     
🇦🇪	AED		 ---------------   ${price[7]} 
🇯🇵	JPY		   ---------------   ${price[8]} 
🇩🇯	DJF		  ---------------   ${price[9]} 
🇰🇪	KES		 ---------------   ${price[10]} 
🇮🇳	INR		 ---------------   ${price[11]} 
`
	let caption = {
		title: `${date} Ethiopian money exchange rate`,
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
		sourceURL: "https://www.fxexchangerate.com/",
	}
	return data
}

exports.fetchAndPost = async function () {
	let feed = await parser.parseURL(rssURL)
	// let feed = JSON.parse(fs.readFileSync(path.join(__dirname, "./result.json")))
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
