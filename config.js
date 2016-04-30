module.exports = {
  express: {
  	env: 'development',
  	port: 11011,
  	routing: {
  		pages: ['index'],
  		strict: true
  	},
  	views: {
  		dir: './views',
  		engine: 'jade'
  	}
  }
}