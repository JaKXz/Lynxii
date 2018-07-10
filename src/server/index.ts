import { createDebuggerFor } from 'lynxii-core/util/debug'
import { Constants } from 'lynxii-core'
import { resolve, join } from 'path'
import * as pkg from './package.json'
import * as minimist from 'minimist'
import LynxiiDatabase from './util/database'
import logger from 'lynxii-core/util/logger'

const args = minimist(process.argv.slice(2))

logger.createDebugger = (name: string, ...ns: string[]) => createDebuggerFor(pkg.name, ...[ name ].concat(ns))
const _debug = logger.createDebugger('init')

_debug('start init')

async function main (): Promise<void> {
  _debug('main start')
  logger.info('setting up, just a moment...')

  const databaseName = args.database || LynxiiDatabase.DEFAULT_NAME
  const dataDir = join(process.cwd(), Constants.Directories.SERVER_DATA)
  const databasePath = resolve(dataDir, databaseName)

  const db = await LynxiiDatabase.open(databasePath)
  await db.write()
  logger.info('database initialized successfully, created ' + db.createdString)

  await db.close()
}

main().catch(console.error)
