module.exports = function(grunt) {
	grunt.initConfig({
		/*copy: {
			js: {
				files: {
					'js/lib/jquery.js':'node_modules/jquery/dist/jquery.js',
					'js/lib/chart.js':'node_modules/chart.js/dist/chart.js'
				}
			}
		},*/
		watch: {
			gfile: {
				files: 'Gruntfile.js',
				tasks: ['copy','babel','sass']
			},
			sass: {
				files: ['src/sass/**/*.sass'],
				tasks: ['sass']
			},
			js: {
				files: ['src/es6/*.es6'],
				tasks: ['babel']
			}
		},
		sass: {
			all: {
				files: [{
					expand: true,
					cwd: './src/sass/',
					src: 'main.sass',
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
	//grunt.loadNpmTasks('grunt-contrib-copy')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-contrib-sass')
	grunt.loadNpmTasks('grunt-babel')

	grunt.registerTask('default',['watch'])
}