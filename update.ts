///<reference path="./index.d.ts"/>
///<reference path="./workspace.d.ts" />

import * as pkg from './package.json'
import * as path from 'path'

import { promises as fs, constants as fsConst } from 'fs'

/** Processes the given project */
async function processProject (name: string) {
  console.log(`processing project: ${name}`)

  // check package exists and is valid
  const dir = path.join(__dirname, 'src', name)
  const stats = await fs.stat(dir)
  if (!stats.isDirectory()) throw new Error ('ENOTDIR: Given project is not a directory')
  const pkgDir = path.join(dir, 'package.json')
  const pkgStats = await fs.stat(pkgDir)
  if (!pkgStats.isFile()) throw new Error('ENOTFILE: Given project\'s package is not a file')

  // create the handle for the file
  const handle = await fs.open(pkgDir, fsConst.O_RDWR)

  // get package data
  const newName = `${pkg.name}-${name}`
  const current = JSON.parse((await handle.readFile()).toString('utf-8'))
  const overrides = pkg.project.overridePackageKeys[name] || { }
  const forwardedKeys = pkg.project.forwardedPackageKeys || [ ]
  const forwards: StringMap = { }
  for (const forwardedKey of forwardedKeys) forwards[forwardedKey] = pkg[forwardedKey]
  const config: StringMap = pkg.project.defaultConfig[name]
    ? {
      name: newName,
      config: pkg.project.defaultConfig[name]
    } : undefined

  // create the new package
  const newPackage = {
    name: newName,
    version: `${pkg.version}+${name}`,
    dependencies: current.dependencies,
    devDependencies: current.devDependencies,
    scripts: {
      // TODO
    },
    config,
    ...forwards,
    ...overrides
  }

  // write the new package to disk and close the handle
  const data = Buffer.from(JSON.stringify(newPackage, null, 2) + '\n')
  await handle.truncate(data.length)
  await handle.writeFile(data)
  await handle.close()
}

const project = process.argv.slice(2)[0]
if (!project) throw new Error('A project name must be provided')
processProject(project).catch(console.error)
