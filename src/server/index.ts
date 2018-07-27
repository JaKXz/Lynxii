
/// <reference types="lynxii-common" />

import globalLogger from './lib/logger'
import * as pkg from './package.json'

// initialize the global logger
const logger = globalLogger(pkg.name)

logger.info('%s v%s', pkg.productName, pkg.version)
logger.debug('versions: %O', process.versions)
