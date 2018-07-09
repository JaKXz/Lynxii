import { DebuggerInitializer, default as createDebugger } from './debug'
import * as winston from 'winston'
import { Constants } from '../'
import { join } from 'path'

/** An initializer function to create a logger */
export type LoggerIntializer = (ns: string) => Logger

export interface Logger extends winston.Logger {
  /** Creates a new sublogger from this one */
  createSublogger: LoggerIntializer

  /** The parent logger to this one, if any */
  parent?: Logger

  /** The logger's namespace, if any */
  namespace?: string

  /** A reference to the global logger */
  global: GlobalLogger
}

export type GlobalLoggerWriteFunction = (msg: string) => void

export interface GlobalLogger extends Logger {
  /** Writes the given message to `stdout` */
  writeOut: GlobalLoggerWriteFunction

  /** Writes the given message to `stderr` */
  writeErr: GlobalLoggerWriteFunction

  /** A function to create a debugger */
  createDebugger: DebuggerInitializer
}

let globalLogger: GlobalLogger

globalLogger = createGlobalLogger(Constants.Directories.LOGS, Constants.MAX_LOG_FILES)
export default globalLogger

export function createGlobalLogger (logDir: string, maxFiles?: number): GlobalLogger {
  const logger = initLogger(logDir, maxFiles) as GlobalLogger
  logger.writeOut = (msg: string) => process.stdout.write(msg)
  logger.writeErr = (msg: string) => process.stderr.write(msg)
  logger.createDebugger = createDebugger
  return logger
}

function generateWinstonLogger (dir: string, maxFiles?: number, ns?: string): winston.Logger {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf((info: any) => `${info.timestamp} ${info.level}: ${ns ? '[' + ns + '] ' : ''}${info.message}`)
    ),
    transports: [
      new winston.transports.Console({
        stderrLevels: [ 'warn', 'error' ]
      }),
      new winston.transports.File({
        filename: join(dir, Constants.Files.SERVER_LOG),
        maxsize: 1024 * 250,
        maxFiles: maxFiles,
        zippedArchive: true
      })
    ]
  })
}

/** Creates a new winston logger */
function initLogger (dir: string, maxFiles?: number, ns?: string): Logger {
  const logger = generateWinstonLogger(dir, maxFiles) as Logger

  logger.createSublogger = (ns: string): Logger => {
    const subLogger = initLogger(dir, maxFiles, ns + ':ns')
    subLogger.parent = logger
    return subLogger
  }
  logger.namespace = ns
  logger.global = globalLogger

  return logger
}
