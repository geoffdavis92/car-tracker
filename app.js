'use strict';

const express = require('express'), 
	  config = require('./config.js').express, 
	  app = express()

// server config
app
	.set('env',config.env)
	.set('strict routing',config.routing.strict)
	.set('view engine',config.views.engine)
	.set('views',config.views.dir)
	.use('/js',express.static(__dirname+'/js'))
	.use('/css',express.static(__dirname+'/css'))

app.listen(config.port)
console.log(`App started at ${config.port}`);

app.get('/',(rq,rs) => rs.render('index'))

const pageList = config.routing.pages
for (let i=1;i<pageList;i++) {
	let page = pageList[i]
	app.get(`/${page}`,(rq,rs) => rs.render(`${page}`))
}