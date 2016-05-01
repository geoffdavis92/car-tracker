'use strict';

const express = require('express'), 
	  config = require('./config.js').express,
	  data = require('./data/car_tracker_data-5116.csv')
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
	if (dataset.query) response['query'] = dataset.query
	if (dataset.route) response['route'] = { path: dataset.route.path, methods: dataset.route.methods }
	return console.log(response)
}

// app.get('/', function (req,res) {
// 	logData(req)
// 	res.render('index',data.pages[0])
// })

app.get('/data/car-tracker', function (req,res) {
	let dataArr = data.split('\n'),
		categories = dataArr[0].replace(/\s|\//g,'_').replace(/\_$/g,'').toLowerCase().split(','),
		byCategories = {},
		byDates = {}

	for (let i=0;i<categories.length;i++) {
		// iterate through categories
		byCategories[categories[i]] = {}
		for (let _i=1;_i<dataArr.length;_i++) {
			// iterate through dataset, starting after category row
		}
	}

	res.send('meta data!')
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