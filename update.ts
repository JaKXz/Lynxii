import * as pkg from './package.json'
import * as path from 'path'
import * as minimist from 'minimist'
import { promises as fs, constants as fsConst } from 'fs'

/** Generates the effective package JSON */
function generateEffectivePackage (name: string, overrides, keys): any {
  const eff = Object.assign({ }, keys, overrides)
  eff.version += '+' + name

  return eff
}

/** Processes the given project */
async function processProject (name: string) {
  console.log(`processing project: ${name}`)
  const dir = path.join(__dirname, 'src', name)
  const stats = await fs.stat(dir)
  if (!stats.isDirectory()) throw new Error ('ENOTDIR: Given project is not a directory')

  const pkgDir = path.join(dir, 'package.json')
  const pkgStats = await fs.stat(pkgDir)
  if (!pkgStats.isFile()) throw new Error('ENOTFILE: Given project\'s package is not a file')

  const overrides = pkg.project.overridePackageKeys[name] || { }
  const keys = { }

  for (const key of pkg.project.forwardedPackageKeys) keys[key] = pkg[key]

  const handle = await fs.open(pkgDir, fsConst.O_RDWR | fsConst.O_CREAT)

  const currentPkg = JSON.parse((await handle.readFile()).toString('utf-8'))
  keys['dependencies'] = currentPkg.dependencies
  keys['scripts'] = { start: pkg.scripts.__run + ' index.ts' }
  keys['name'] += '-' + name

  const data = Buffer.from(JSON.stringify(generateEffectivePackage(name, overrides, keys), null, 2) + '\n')
  await handle.truncate(data.length)
  await handle.writeFile(data)
  await handle.close()
}

const args = minimist(process.argv.slice(2))
const project = args._[0]

if (!project) throw new Error('A project name must be provided')
processProject(project).catch(console.error)
