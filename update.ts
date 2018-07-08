///<reference path="./index.d.ts"/>
///<reference path="./workspace.d.ts" />

import * as pkg from './package.json'
import * as project from './project.json'
import * as path from 'path'

import { promises as fs, constants as fsConst } from 'fs'

/** Verifies a valid package.json exists for the given project */
async function verifyPackage (projectName: string): Promise<string> {
  const dir = path.join(__dirname, 'src', projectName)
  const stats = await fs.stat(dir)
  if (!stats.isDirectory()) throw new Error ('ENOTDIR: Given project is not a directory')
  const pkgDir = path.join(dir, 'package.json')
  const pkgStats = await fs.stat(pkgDir)
  if (!pkgStats.isFile()) throw new Error('ENOTFILE: Given project\'s package is not a file')

  return pkgDir
}

function generateNewPackage (current: Package.Root): Package.Root {
  // get package data
  const newName = `${pkg.name}-${projectName}`
  const overrides = project.overridePackageKeys[projectName] || { }
  const forwardedKeys = project.forwardedPackageKeys || [ ]
  const forwards: StringMap = { }
  for (const forwardedKey of forwardedKeys) forwards[forwardedKey] = pkg[forwardedKey]
  const config: StringMap = project.defaultConfig[projectName]
    ? {
      name: newName,
      config: project.defaultConfig[projectName]
    } : undefined

  // create the new package
  return {
    name: newName,
    version: `${pkg.version}+${projectName}`,
    dependencies: current.dependencies,
    devDependencies: current.devDependencies,
    scripts: {
      start: 'node index'
    },
    config,
    ...forwards,
    ...overrides
  }
}

/** Processes the given project */
async function processProject (projectName: string) {
  console.log(`processing project: ${projectName}`)
  const pkgDir = await verifyPackage(projectName)

  // create the handle for the file
  const handle = await fs.open(pkgDir, fsConst.O_RDWR)
  const current = JSON.parse((await handle.readFile()).toString('utf-8')) as Package.Root

  const newPackage = generateNewPackage(current)

  // write the new package to disk and close the handle
  const data = Buffer.from(JSON.stringify(newPackage, null, 2) + '\n')
  await handle.truncate(data.length)
  await handle.writeFile(data)
  await handle.close()
}

const projectName = process.argv.slice(2)[0]
if (!projectName) throw new Error('A project name must be provided')
processProject(projectName).catch(console.error)
