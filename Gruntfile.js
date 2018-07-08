const infoCopy = '{README.md,LICENSE}'

exports = module.exports = grunt => {
  require('time-grunt')(grunt)
  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    // Cleanup
    clean: {
      temp: [
        '.nyc_output',
        '.tmp'
      ],
      dist: [
        'dist'
      ],
      errors: [
        '**/*-error.log'
      ],
      coverage: [
        'coverage',
        '.nyc_output'
      ],
      target: [
        'target'
      ]
    },

    compress: {
      server_tar: {
        options: {
          archive: 'target/server.tar.gz',
          mode: 'tgz'
        },
        files: [
          {
            expand: true,
            cwd: 'dist/server',
            src: [ '**' ],
            dest: 'server'
          }
        ]
      },
      server_zip: {
        options: {
          archive: 'target/server.zip',
          mode: 'zip'
        },
        files: [
          {
            expand: true,
            cwd: 'dist/server',
            src: [ '**' ],
            dest: 'server'
          }
        ]
      }
    },

    // Copy
    copy: {
      json: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: '**/*.json',
            dest: 'dist'
          }
        ]
      },
      server_info: {
        files: [
          {
            expand: true,
            src: infoCopy,
            dest: 'dist/server'
          }
        ]
      },
      client_info: {
        files: [
          {
            expand: true,
            src: infoCopy,
            dest: 'dist/client'
          }
        ]
      }
    },

    // Shell Executions
    exec: {
      tsc: {
        cmd: 'yarn exec:tsc',
        stdout: 'inherit'
      },
      nyc: {
        cmd: 'yarn exec:nyc',
        stdout: 'inherit'
      },
      update_server: {
        cmd: 'yarn exec:script update.ts server',
        stdout: 'inherit'
      },
      update_client: {
        cmd: 'yarn exec:script update.ts client',
        stdout: 'inherit'
      },
      license: {
        cmd: 'yarn exec:script license.ts dist',
        stdout: 'inherit'
      }
    }
  })

  grunt.registerTask('clean:all', [
    'clean:temp',
    'clean:dist',
    'clean:errors',
    'clean:coverage',
    'clean:target'
  ])
  grunt.registerTask('copy:all', [
    'copy:json',
    'copy:server_info',
    'copy:client_info'
  ])
  grunt.registerTask('compress:all', [
    'compress:server_tar',
    'compress:server_zip'
  ])
  grunt.registerTask('tsc', [ 'exec:tsc' ])
  grunt.registerTask('nyc', [ 'exec:nyc' ])
  grunt.registerTask('update', [ 'exec:update_server', 'exec:update_client' ])
  grunt.registerTask('license', [ 'exec:license' ])
  grunt.registerTask('test', [ 'nyc' ])

  grunt.registerTask('compile', [
    'tsc',
    'test'
  ])

  grunt.registerTask('build', [
    'clean:all',
    'compile',
    'license',
    'copy:all',
    'compress:all'
  ])
}
