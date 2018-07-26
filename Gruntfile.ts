
/// <reference path="project.d.ts"/>

import 'grunt'

import { parse } from 'cson'
import { readFileSync } from 'fs'

/**
 * The primary grunt config, invoked by Grunt
 * @param grunt The grunt module
 */
function init (grunt: IGrunt): void {
  // Pre-configuration
  require('time-grunt')(grunt)
  require('load-grunt-tasks')(grunt)

  // Project configuration
  const project = parse(readFileSync('./project.cson').toString('utf8')) as Project
  const { build } = project
  const targets = Object.keys(build.targets)

  const compressTasks = { }
  const copyTasks = { }

  // tasks for each target
  for (const targetName of targets) {
    const target = build.targets[targetName]

    // compression for final deployment
    for (const compressMode of Object.keys(target.modes)) {
      compressTasks[`${targetName}_${compressMode}`] = {
        files: [
          {
            cwd: `${build.output}/${build.dirs.compiled}/${targetName}`,
            dest: targetName,
            expand: true,
            src: [ '**' ]
          }
        ],
        options: {
          archive: `${build.output}/${build.dirs.target}/${targetName}.${target.modes[compressMode]}`,
          mode: compressMode
        }
      }
    }

    // direct file copies
    copyTasks[targetName + '_info'] = {
      files: [
        {
          cwd: 'src/',
          dest: `${build.output}/${build.dirs.compiled}`,
          expand: true,
          src: [ '**/*.+(md|json)', 'yarn.lock' ]
        }
      ]
    }
    grunt.registerTask('copy:' + targetName, [
      'copy:' + targetName + '_info'
    ])
  }

  const execTasks = { }

  const makeExec = (name: string, cmd: string, opts = {}) => {
    execTasks[name] = {
      cmd,
      stdout: 'inherit',
      ...opts
    }
  }
  makeExec('tsc', `tsc --project tsconfig.json --outDir ${build.output}/${build.dirs.compiled}`)
  makeExec('nyc', 'nyc mocha')
  makeExec('update', 'yarn tsexec update.ts')
  makeExec('license', `yarn tsexec license.ts ${build.output}/${build.dirs.compiled}`)

  // Basic configuration
  grunt.initConfig({
    // Directory cleanup
    clean: {
      dist: [
        build.output
      ],
      general: [
        '.cache',
        '.temp',
        '.tmp',
        '**/+(yarn|npm)*.log'
      ],
      tests: [
        '.nyc_output',
        build.coverage
      ]
    },

    // Build compression
    compress: {
      ...compressTasks
    },

    // Direct file copies
    copy: {
      ...copyTasks
    },

    // Misc scripts
    exec: {
      ...execTasks
    }
  })

  const registerAllTask = (task: string) => grunt.registerTask(
    task + ':all', Object.keys(grunt.config.get(task)).map(key => task + ':' + key))

  // Task registration
  grunt.registerTask('test', [ 'exec:nyc' ])
  grunt.registerTask('compile', [ 'exec:tsc', 'test', 'exec:license' ])
  grunt.registerTask('build', [ 'clean:dist', 'clean:tests', 'compile', 'copy:all', 'compress:all' ])

  registerAllTask('clean')
  registerAllTask('copy')
  registerAllTask('compress')
}

exports = module.exports = init
