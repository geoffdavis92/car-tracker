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
		sass: {
			all: {
				files: [{
					expand: true,
					cwd: './src/sass/',
					src: 'styles.sass',
					dest: './css/',
					ext: '.css'
				}]
			}
		},
		babel: {
			all: {
				files: [{
					expand: true,
					cwd: './src/es6/',
					src: ['*.es6'],
					dest: './js/',
					ext: '.js'
				}]
			}
		}
	})
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-contrib-sass')
	grunt.loadNpmTasks('grunt-babel')

	grunt.registerTask('default',['watch'])
}