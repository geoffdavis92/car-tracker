module.exports = {
  pages: [
  	{
  		title: 'Error',
  		route: '/error',
  		noindex: true
  	},
  	{
  		title: 'Home',
  		alias: 'index',
  		route: '/'
  	},
  	{
  		title: 'Odometer',
  		alias: 'odo',
  		route: '/odo'
  	},
  	{
  		title: 'MPg',
  		alias: 'mpg',
  		route: '/mpg'
  	},
  	{
  		title: 'MPh',
  		alias: 'mph',
  		route: '/mph'
  	},
    {
      title: 'Cost',
      alias: 'cost',
      route: '/cost'
    }
  ],
  headScripts: ['get'],
  libScripts: ['jquery','chart']
}