
import LynxiiLogger from 'lynxii-common/lib/logger'

export let globalLoggerInstance: LynxiiLogger

/**
 * Gets the current global logger, if there is one. Otherwise, one is created
 * as long as a package name is provided
 * @param packageName The package name used to create the logger
 */
export default function globalLogger (packageName?: string): LynxiiLogger {
  if (!globalLoggerInstance) {
    if (!packageName) throw new Error('Package name must be provided when created a global logger')
    globalLoggerInstance = new LynxiiLogger(packageName)
  }
  return globalLoggerInstance
}
