// tslint:disable:no-console

/// <reference path="./project.d.ts"/>

import * as pkg from './package.json'

import { execSync } from 'child_process'
import { parse } from 'cson'
import { constants as fsConst, promises as fs, readFileSync, Stats } from 'fs'
import * as path from 'path'

const project = parse(readFileSync('./project.cson').toString('utf8')) as Project
const commit = execSync('git rev-parse HEAD').toString('utf8').substring(0, 7).toUpperCase()

// tslint:disable-next-line:no-string-literal
if (project['error']) throw new Error(project['error'])

const header = `/*!
 * ${pkg.name} is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any
 * later version.
 *
 * ${pkg.name} is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with ${pkg.name}. If not,
 * see http://www.gnu.org/licenses/.
 *
 * @commit ${commit}
 * @compiled ${new Date().toUTCString()}
 * @author ${pkg.author}
 */
`

/** Determines if a given file has a valid extension */
function hasExtension (file: string): boolean {
  for (const ext of project.license.extensions) {
    if (file.endsWith(ext)) return true
  }

  return false
}

/** Processes the given file */
async function processFile (file: string, prefix: string) {
  console.log(`prcs ${prefix}`)

  const handle = await fs.open(file, fsConst.O_RDWR | fsConst.O_CREAT)

  const contents = await fs.readFile(handle, { encoding: 'utf-8' })
  await fs.writeFile(handle, header + contents, { encoding: 'utf-8' })

  await handle.close()
}

async function preprocessFile (fileName: string, file: string, filePrefix: string, stats: Stats) {
  if (stats.isFile() && hasExtension(fileName)) await processFile(file, filePrefix)
  else if (stats.isDirectory()) await enterDirectory(file, filePrefix)
  else console.log(`skip ${filePrefix}`)
}

/** enters the given directory */
async function enterDirectory (dir: string, prefix: string) {
  console.log(`entr ${prefix}`)
  const files = await fs.readdir(dir)

  for (const fileName of files) {
    const file = path.join(dir, fileName)
    const stats = await fs.stat(file)
    const filePrefix = path.join(prefix, fileName)

    await preprocessFile(fileName, file, filePrefix, stats)
  }
}

const target = process.argv.slice(2)[0]
if (!target) throw new Error('Must specifiy a directory')

enterDirectory(path.resolve(__dirname, target), target).catch(console.error)
