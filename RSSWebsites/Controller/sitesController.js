const fs = require('fs')
const path = require('path')

const shortid = require('shortid')

const dbJSON = path.join(__dirname, '..', '..', 'data', 'NEWS.json')

// button for posts with their own image
let btnBusiness = [
	[
		{ text: '#Ethiopian_Business_Daily', callback_data: 'post2merkato' },
		{ text: 'remove', callback_data: 'remove' },
	],
]
// button for posts without their own image
let btn4noImgBusiness = [
	[
		{
			text: '#Ethiopian_Business_daily',
			callback_data: 'noResponse',
		},
		{
			text: 'Remove',
			callback_data: 'remove',
		},
	],
	[
		{
			text: 'DNEth',
			callback_data: 'DNEth',
		},
		{
			text: 'EPEth',
			callback_data: 'EPEth',
		},
		{
			text: 'DNInt',
			callback_data: 'DNInt',
		},
		{
			text: 'EPInt',
			callback_data: 'EPInt',
		},
	],
	[
		{
			text: 'NREth',
			callback_data: 'NREth',
		},
		{
			text: 'NUEth',
			callback_data: 'NUEth',
		},
		{
			text: 'NRInt',
			callback_data: 'NRInt',
		},
		{
			text: 'NUInt',
			callback_data: 'NUInt',
		},
	],
	[
		{
			text: 'BNEth',
			callback_data: 'BNEth',
		},
		{
			text: 'BNInt',
			callback_data: 'BNInt',
		},
		{
			text: 'Evnt',
			callback_data: 'Evnt',
		},
		{
			text: 'Condo',
			callback_data: 'Condo',
		},
	],
	[
		{
			text: 'Oil',
			callback_data: 'Oil',
		},
		{
			text: 'Tech',
			callback_data: 'Tech',
		},
		{
			text: 'Transp',
			callback_data: 'Transp',
		},
		{
			text: 'Trsm',
			callback_data: 'Trsm',
		},
	],
]

let btnNetflix = [
	[
		{
			text: '#Netflix_Addis',
			callback_data: 'postNetflix',
		},
		{
			text: 'remove',
			callback_data: 'remove',
		},
	],
]

exports.saveFeeds = function (feeds) {
	data = JSON.parse(fs.readFileSync(dbJSON), 'utf-8')
	feeds.forEach(feed => {
		x = { ...feed }
		delete x.buttons
		data.push(x)
	})
	fs.writeFileSync(dbJSON, JSON.stringify(data), 'utf-8', err => {
		console.log(err)
	})
}
