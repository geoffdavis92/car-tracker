module.exports = {
  express: {
  	env: 'development',
  	port: 11011,
  	routing: {
  		strict: true
  	},
  	views: {
  		dir: './views',
  		engine: 'jade'
  	}
  }
}