const path = require("path")
const fs = require("fs")

const Telegraf = require("telegraf")

const bot = new Telegraf("1295703321:AAGfhPgd9sf7o8jW_XL8o1OO9aekYKjbS0o")

let dbJSON = path.join(__dirname, "data", "NEWS.json")

bot.action("noResponse", (ctx) => {
	ctx.answerCbQuery()
})

bot.action("post2Netflix", channelPostController)
bot.action("post2EBD", channelPostController)
bot.action("DNEth", channelPostController)
bot.action("EPEth", channelPostController)
bot.action("DNInt", channelPostController)
bot.action("EPInt", channelPostController)
bot.action("NREth", channelPostController)
bot.action("NUEth", channelPostController)
bot.action("NRInt", channelPostController)
bot.action("NUInt", channelPostController)
bot.action("BNEth", channelPostController)
bot.action("BNInt", channelPostController)
bot.action("Evnt", channelPostController)
bot.action("Condo", channelPostController)
bot.action("Oil", channelPostController)
bot.action("Tech", channelPostController)
bot.action("Transp", channelPostController)
bot.action("Trsm", channelPostController)
bot.action("Fin", channelPostController)
bot.action("Contr", channelPostController)
bot.action("Covid", channelPostController)
bot.action("Tip", channelPostController)

bot.action("remove", (ctx) => {
	ctx.deleteMessage()
	let caption = ctx.update.callback_query.message.caption
	let id = caption.slice(caption.indexOf("__id") + 5, caption.indexOf("@#$%"))
	let feeds = JSON.parse(fs.readFileSync(dbJSON), "utf-8")
	feed = feeds.find((el) => el.__id == id)
	feeds.splice(feeds.indexOf(feed), 1)
	fs.writeFileSync(dbJSON, JSON.stringify(feeds), "utf-8", (err) => {
		console.log(err)
	})
})

let post = async function ({ caption, photo, chatID, buttons, sourceURL }) {
	caption.sourceURL = sourceURL
	if (caption.to == "toGroup") {
		if (photo.source == "local") {
			await bot.telegram.sendPhoto(
				chatID,
				{ source: photo.location },
				{
					caption: prepareCaption(caption),
					reply_markup: {
						inline_keyboard: buttons,
					},
					parse_mode: "HTML",
				}
			)
		} else {
			await bot.telegram.sendPhoto(chatID, photo.location, {
				caption: prepareCaption(caption),
				reply_markup: {
					inline_keyboard: buttons,
				},
				parse_mode: "HTML",
			})
		}
	} else {
		if (photo.source == "local") {
			await bot.telegram.sendPhoto(
				chatID,
				{
					source: photo.location,
				},
				{
					caption: prepareCaption(caption),
					parse_mode: "HTML",
				}
			)
		} else {
			await bot.telegram.sendPhoto(chatID, photo.location, {
				caption: prepareCaption(caption),
				parse_mode: "HTML",
			})
		}
	}
}

function prepareCaption(caption) {
	if (caption.to == "toGroup") {
		return `
    <u><b>${caption.title}</b></u>
    
${caption.description}

__id:${caption.__id}@#$%
`
	} else if (caption.to == "toChannel") {
		return `
    <u><b>${caption.title}</b></u>
    
${caption.description}

<a href="${caption.sourceURL}">READ MORE</a>
    `
	}
}

function channelPostController(ctx) {
	ctx.answerCbQuery()
	let caption = ctx.update.callback_query.message.caption
	let id = caption.slice(caption.indexOf("__id") + 5, caption.indexOf("@#$%"))
	let data = getDataFromSavedFile(id)
	if (data) {
		let photoURL = data.photo.location
		if (data.photo.source == "local") {
			let imgName = ctx.update.callback_query.data
			photoURL = path.join(__dirname, "data", "images", `${imgName}.jpg`)
		}

		data.caption.to = "toChannel"
		data.caption.PhotoURL = photoURL
		data.photo.location = photoURL
		data.chatID = process.env.testChannelID
		post(data).catch((err) => {
			console.log(err)
		})
	}
	ctx.deleteMessage()
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

module.exports = {
	bot,
	post,
}
