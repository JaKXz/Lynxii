import { createDebuggerFor } from 'lynxii-core/util/debug'
import * as pkg from './package.json'
import logger from 'lynxii-core/util/logger'

logger.createDebugger = (name: string, ...ns: string[]) => createDebuggerFor(pkg.name, ...[ name ].concat(ns))
const _debug = logger.createDebugger('init')

logger.info('setting up, just a moment...')
_debug('start init')
