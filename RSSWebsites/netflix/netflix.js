const fs = require('fs')
const path = require('path')

const Parser = require('rss-parser')
const shortid = require('shortid')

const bot = require('./../../bot')
const siteController = require('./../Controller/sitesController')

const latestTitles = path.join(__dirname, '..', '..', 'data', 'latest.json')
const rssURL = 'https://www.whats-on-netflix.com/feed/'

let parser = new Parser()
let btn = [
	[
		{
			text: '#Netflix_Addis',
			callback_data: 'post2Netflix',
		},
		{
			text: 'remove',
			callback_data: 'remove',
		},
	],
]

let prepareFeeds = function (feeds) {
	return feeds.map(feed => {
		let imageLocation = ''
		let imageSource = ''
		let start = feed.content.indexOf('src="https:') + 5
		let end = feed.content.indexOf('.jpg')
		if (end == -1) {
			end = feed.content.indexOf('.png')
		}
		if (start == -1 || end == -1) {
			imageLocation = path.join(__dirname, '..', '..', 'data', 'images', 'nopic.jpg')
			imageSource = 'local'
		} else {
			end += 4
			imageLocation = feed.content.slice(start, end)
			imageSource = 'remote'
		}

		let caption = {
			title: feed.title,
			description: feed.contentSnippet.trim(),
			footer: `<b>"Stay Home, Stay Safe"</b>

Contact - @NetflixAddis_CustomerService

Join, Buy and Watch Netflix
		  🍿🍿🍿🍿🍿
		 @NetflixAddiss`,
			// date: feed.date,
			to: 'toGroup',
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
			sourceURL: feed.link,
		}
		return data
	})
}
exports.fetchAndPost = async () => {
	console.log('netflix In')
	try {
		let website = 'netflix'
		let titles = JSON.parse(fs.readFileSync(latestTitles, 'utf-8'))
		let latestTitle = titles.find(el => el.website == website).latestTitle
		let newNEWS = []

		let feed = await parser.parseURL(rssURL)

		let items = feed.items.slice(0, 5)
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
			let totalNewNEWS = newNEWS.length
			let preparedFeeds = prepareFeeds(newNEWS)
			siteController.saveFeeds(preparedFeeds)
			let initialFeed = {
				caption: {
					title: '',
					description: `🍿What is new?🍿

May 28, 2020 on Netflix.
									
"Stay Home, Stay Safe"`,
					footer: `@NetflixAddiss`,
					to: 'toGroup',
					__id: shortid.generate(),
				},
				photo: {
					location: path.join(__dirname, '..', '..', 'data', 'images', 'netflixAddis.jpg'),
					source: 'local',
				},
				chatID: process.env.testGroupID,
				buttons: btn,
				sourceURL: 'https://www.whats-on-netflix.com/',
			}
			siteController.saveFeeds([initialFeed])
			bot.post(initialFeed).catch(err => console.log(err))
			let count = 0
			preparedFeeds.forEach(item => {
				bot
					.post(item)
					.then(() => {
						++count
						if (count == totalNewNEWS) {
							titles = JSON.parse(fs.readFileSync(latestTitles, 'utf-8'))
							titles[titles.findIndex(el => el.website == website)].latestTitle = latestTitle
							fs.writeFileSync(latestTitles, JSON.stringify(titles), 'utf-8')
						}
						console.log(`${count}: netflix`)
					})
					.catch(err => {
						console.log(err)
					})
			})
		}
	} catch (err) {
		console.log(err)
	}
}
