'use strict';

const express = require('express'), 
	  config = require('./config.js').express,
	  data = require('./data/car_tracker_data-5316.js').csv,
	  devLocals = require('./data/locals.dev.js'),
	  app = express()

// server config
app
	.set('env',config.env)
	.set('strict routing',config.routing.strict)
	.set('view engine',config.views.engine)
	.set('views',config.views.dir)
	.use('/js',express.static(`${__dirname}/js`))
	.use('/css',express.static(`${__dirname}/css`))
	.use('/data',express.static(`${__dirname}/data`))
	.use('/assets',express.static(`${__dirname}/assets`))

// Spin up server
app.listen(config.port)
console.log(`App started at ${config.port}`);
// Data config
app.locals = devLocals
const parseData = function () {
	let dataArr = data.toString().split('\n'),
		categories = dataArr[0].replace(/\s|\//g,'_').replace(/\_$/g,'').toLowerCase().split(','),
		byCategory = {},
		byCategoryTrimmed = {},
		byDate = {}
	// Trim Categories
	for (let i=0;i<categories.length;i++) {
		// iterate through categories
		byCategoryTrimmed[categories[i]] = []
		for (let _i=1;_i<dataArr.length;_i++) {
			// iterate through dataset, starting after category row
			let row = dataArr[_i].split(',')[i]
			if (categories[i] === 'date') {
				row = new Date(row)
				row = row.toString().replace(/GMT\-0\d00|\(CDT\)|\(CST\)/g,'').replace(/\:00\s/g,'').replace(/Sun|Mon|Tue|Wed|Thu|Fri|Sat/g,'').replace(/^\s|\s$/g,'')
			}
			byCategoryTrimmed[categories[i]].push(row) // dataArr[_i].split(',')[i]
		}
	}
	// Organize by Categories
	for (let i=0;i<categories.length;i++) {
		// iterate through categories
		byCategory[categories[i]] = []
		for (let _i=1;_i<dataArr.length;_i++) {
			// iterate through dataset, starting after category row
			let row = dataArr[_i].split(',')[i]
			if (categories[i] === 'date') {
				row = new Date(row)
				row = row.toString().replace(/GMT\-0\d00|\(CDT\)|\(CST\)/g,'').replace(/\:00\s/g,'')
			}
			byCategory[categories[i]].push(row) // dataArr[_i].split(',')[i]
		}
	}
	// Organize by Date
	for (let i=1; i<dataArr.length;i++) {
		// Iterate through dataset, starting after category row
		let formattedDate = dataArr[i].split(',')[0].replace(/\/|\:|/g,'').replace(/\s/g,'_')
		byDate[formattedDate] = []
		for (let _i=1;_i<dataArr[i].split(',').length;_i++) {
			// Iterate through data point
			let pushObj = {}
			// set current row's _i prop to pushObj category's value
			pushObj[categories[_i]] = dataArr[i].split(',')[_i]
			// push
			byDate[formattedDate].push(pushObj)
		}
	}

	return {
		byCategory, byCategoryTrimmed, byDate
	}
}

// Routes
const logData = function (dataset) {
	let response = {}
	if (dataset.query !== {}) response['query'] = dataset.query
	if (dataset.route) response['route'] = { path: dataset.route.path, methods: dataset.route.methods }
	if (dataset.params) response.route['params'] = dataset.params
	console.log(response)
	return response
}

const dataPath = {
	get: '/data/get',
	post: '/data/post'
}
app.get([`${dataPath.get}/:id/:prop`,`${dataPath.get}/:id`], function (req,res) {
	// console.log(req)
	logData(req)
	switch(req.params.id) {
		case ('car'): 
			switch(req.params.prop) {
				case 'category':
					if (req.query.trim === 'true' || req.query.trim === '') {
						res.send(parseData().byCategoryTrimmed)
					} else {
						res.send(parseData().byCategory)
					}
					break;
				case 'date':
					res.send(parseData().byDate)
					break;
				default: 
					if (req.params.prop === undefined) {
						res.render('error',{title: 'API Error', msg: `No API property specified.`})
					} else {	
						res.render('error',{title: 'API Error', msg: `No available API property of ${req.params.prop} in ${req.params.id}.`})
					}
					break;
			}
			break;
		default:
			res.render('error',{msg: `${req.params.id ? req.params.id : 'No id'}, ${req.params.prop ? req.params.prop : 'No prop'}`, title: 'Route Check'})
			break;
	}
})

app.get([`${dataPath.get}`,`${dataPath.get}/`], function (req,res) {
	logData(req)	
	// Set up response based on query
	if (req.query.by) {
		switch(req.query.by) {
			case ('category'):
				if (req.query.trim === 'true') {
					res.json(parseData().byCategoryTrimmed)
				} else {
					res.json(parseData().byCategory)
				}
				break;
			case ('date'):
				res.json(parseData().byDate)
				break;
			default:
				res.json(dataArr)
				break;
		}
	} else {
		res.send('Error! No query parameters set.')
	}
})

const pageList = app.locals.pages
for (let i in pageList) {
	let pageTitle = pageList[i].title,
		pageRoute = pageList[i].route,
		pageData = pageList[i]
		// console.log(pageTitle,pageRoute,pageData)
	app.get(`${pageRoute}`, function (req,res) {
		logData(req)
		res.render(`${pageList[i].alias ? pageList[i].alias : pageTitle.toLowerCase()}`,pageData)
	})
}