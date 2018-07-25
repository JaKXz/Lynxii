
/// <reference path="project.d.ts"/>

import 'grunt'

import { parse } from 'cson'
import { readFileSync } from 'fs'

/**
 * The primary grunt config, invoked by Grunt
 * @param grunt The grunt module
 */
export default function (grunt: IGrunt): void {
  // Pre-configuration
  require('time-grunt')(grunt)
  require('load-grunt-tasks')(grunt)

  // Project configuration
  const project = parse(readFileSync('./project.cson').toString('utf8')) as Project
}
