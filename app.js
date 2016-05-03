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

// Routes
const logData = function (dataset) {
	let response = {}
	if (dataset.query !== {}) response['query'] = dataset.query
	if (dataset.route) response['route'] = { path: dataset.route.path, methods: dataset.route.methods }
	console.log(response)
	return response
}

app.get('/data/get', function (req,res) {
	logData(req)
	let dataArr = data.toString().split('\n'),
		categories = dataArr[0].replace(/\s|\//g,'_').replace(/\_$/g,'').toLowerCase().split(','),
		byCategory = {},
		byDate = {}

	for (let i=0;i<categories.length;i++) {
		// iterate through categories
		byCategory[categories[i]] = []
		for (let _i=1;_i<dataArr.length;_i++) {
			// iterate through dataset, starting after category row
			byCategory[categories[i]].push(dataArr[_i].split(',')[i])
		}
	}
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
	
	// Set up response based on query
	if (req.query.by) {
		switch(req.query.by) {
			case ('category'):
				res.send(byCategory)
				break;
			case ('date'):
				res.send(byDate)
				break;
			default:
				res.send(dataArr)
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