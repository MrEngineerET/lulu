const path = require("path")

const Telegraf = require("telegraf")

const bot = new Telegraf("1295703321:AAGfhPgd9sf7o8jW_XL8o1OO9aekYKjbS0o")

bot.action("noResponse", (ctx) => {
	ctx.answerCbQuery()
})

bot.action("remove", (ctx) => {
	ctx.deleteMessage()
})

let post = async function ({ caption, photo, chatID, buttons }) {
	if (buttons) {
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

let prepareCaption = function (caption) {
	if (caption.to == "toGroup") {
		const SPLIT = "@#$"
		return `
    <u><b>${caption.title}${SPLIT}</b></u>
    
${caption.description}${SPLIT}

<a href="${caption.sourceURL}">sourceURL</a>
<a href="${caption.photoURL}">imageURL</a>
__id:${caption.__id}@#$%
`
	} else if (caption.to == "toChannel") {
		return `
    <u><b>${caption.title}</b></u>
    
${caption.description}

For more -> <a href="${caption.sourceURL}">READ MORE</a>
    `
	}
}

module.exports = {
	bot,
	post,
}
