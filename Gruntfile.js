module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			sass: {
				files: ['src/sass/**/*.sass'],
				tasks: ['sass']
			},
			js: {
				files: ['src/js/es6/*.es6'],
				tasks: ['babel']
			}
		},
		sass: {},
		babel: {}
	})
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-babel')

	grunt.registerTask('default',['watch'])
}