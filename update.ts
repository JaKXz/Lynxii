
// tslint:disable:no-console

/// <reference path="./project.d.ts" />

import * as pkg from './package.json'

import { parse } from 'cson'
import { constants as fsConst, promises as fs, readFileSync } from 'fs'
import * as glob from 'glob'
import { basename, join } from 'path'
import { promisify } from 'util'

const project = parse(readFileSync('./project.cson').toString('utf8')) as IProject
const { modules } = project

/**
 * Fetches all directories (ignores files) within the given directory
 * @param dir The directory to look in
 * @returns The directories found
 */
async function fetchDirs (paths: string[]): Promise<string[]> {
  const dirs = [ ]
  for (const file of paths) {
    try {
      const stats = await fs.stat(file)
      if (stats.isDirectory()) dirs.push(file)
    } catch (err) {
      /* no-op */
    }
  }
  return dirs
}

/**
 * Processes the given module directory, updating the package as necessary
 * @param dir The directory of the module
 */
async function processModule (dir: string): Promise<void> {
  const moduleName = basename(dir)
  console.info('processing:', dir)

  const packagePath = join(dir, 'package.json')
  const packageStats = await fs.stat(packagePath)
  if (!packageStats.isFile()) throw new Error('ENOTFILE: Given project\'s package is not a file')

  const handle = await fs.open(packagePath, fsConst.O_RDWR | fsConst.O_CREAT)
  const bufferIn = await handle.readFile()
  const currentPackage = JSON.parse(bufferIn.toString('utf-8')) as Package.IRoot

  const forwards: Package.IRoot = {
    name: `${pkg.name}-${moduleName}`,
    version: `${pkg.version}+${moduleName}`
  }
  for (const key of modules.forwards) forwards[key] = pkg[key]

  const links = modules.links[moduleName]
  let peerDependencies: ITypedStringMap<string> | undefined
  if (links) {
    peerDependencies = { }
    for (const link of links) peerDependencies[`${pkg.name}-${link}`] = pkg.version
  }

  const literals = modules.overrides[moduleName] || { }
  const scripts = modules.scripts[moduleName] || { }

  // tslint:disable:object-literal-sort-keys
  const newPackage: Package.IRoot = {
    ...forwards,
    ...literals,
    scripts: {
      start: 'node .',
      debug: 'node -r ts-node/register .',
      ...scripts
    },
    config: {
      name: forwards.name,
      config: modules.config[moduleName] || { }
    },
    peerDependencies,
    dependencies: currentPackage.dependencies,
    devDependencies: currentPackage.devDependencies
  }
  // tslint:enable:object-literal-sort-keys

  const data = Buffer.from(JSON.stringify(newPackage, null, 2) + '\n')
  if (data.length < bufferIn.length) await handle.truncate(data.length)
  await handle.writeFile(data)
  await handle.close()
}

/**
 * Starts the update process on all workspaces registered to `yarn`.
 */
async function update (): Promise<void> {
  if (pkg.workspaces) {
    let moduleNames: string[] = [ ]
    for (const pattern of pkg.workspaces) {
      const results = await promisify(glob)(pattern)
      moduleNames = moduleNames.concat(await fetchDirs(results))
    }

    for (const moduleName of moduleNames) await processModule(moduleName)
  }
}

update().catch(err => {
  console.error(err)
  process.exit(1)
})
