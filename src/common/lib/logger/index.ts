
import * as debug from 'debug'
import { EventEmitter } from 'events'
import { format } from 'util'
import * as winston from 'winston'

/**
 * The logging level for a specific message
 */
export enum LoggingLevel {
  DEBUG,
  VERBOSE,
  INFO,
  WARN,
  ERROR
}

/**
 * Creates a lower-level Winston logger
 * @returns The logger
 */
export function createWistonLogger (): winston.Logger {
  return winston.createLogger({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf((info: any) => {
        return `${info.timestamp} ${info.level}: ${info.message}`
      })
    ),
    level: 'info',
    transports: [
      new winston.transports.Console({
        stderrLevels: [ 'warn', 'error' ]
      })
      // TODO File transports
    ]
  })
}

export type LoggingFunction = (level: LoggingLevel, message: string, ...data: any[]) => void
export type LeveledLoggingFunction = (message: string, ...data: any[]) => void

/**
 * A logging utility for Lynxii
 */
export interface ILynxiiLogger {
  /** The logger's prefix */
  readonly prefix: string

  /** The logger's parent */
  readonly parent?: ILynxiiLogger

  /** The package name for the logger */
  readonly packageName: string

  /** Data mapping for the prefix */
  readonly prefixData: ReadonlyArray<string>

  /** Whether or not this logger is enabled. When disabled, all logging functions are no-op */
  enabled: boolean

  /**
   * Logs the given message, optionally formatted with the given data
   * @param level The level to log at
   * @param message The message to log
   * @param data Data to format with
   */
  log: LoggingFunction

  /** Sends a debug message */
  debug: LeveledLoggingFunction

  /** Messages a verbose message to the logger */
  verbose: LeveledLoggingFunction

  /** Messages a general message to the logger */
  info: LeveledLoggingFunction

  /** Sends a warning to the logger */
  warn: LeveledLoggingFunction

  /** Sends an error to the logger */
  error: LeveledLoggingFunction

  /**
   * Create a new logger parented to this one
   * @param prefix The prefix of the new logger
   * @returns The newly created logger
   */
  sublogger: (prefix: string) => ILynxiiLogger
}

/**
 * Basic implementation of the Lynxii logger
 * @author Matthew Struble <matt@vevox.io>
 */
export default class LynxiiLoggerImpl extends EventEmitter implements ILynxiiLogger {
  public readonly prefix: string
  public readonly parent?: ILynxiiLogger
  public readonly packageName: string
  public readonly prefixData: ReadonlyArray<string>
  public enabled: boolean = true

  private readonly debugger: debug.IDebugger
  private readonly logger: winston.Logger
  private readonly subLoggers: Map<string, LynxiiLoggerImpl>

  /**
   * Creates a new logger from the given prefix and parent
   * @param prefix The prefix to use
   * @param parent The parent to use, if any
   */
  public constructor (prefix: string, parent?: ILynxiiLogger) {
    super()

    this.packageName = parent ? parent.packageName : prefix
    this.prefixData = parent ? parent.prefixData.concat(prefix) : [ ]

    this.prefix = this.prefixData.join(':')
    this.parent = parent

    this.debugger = debug([ this.packageName ].concat(this.prefixData).join(':'))
    this.logger = createWistonLogger()
    this.subLoggers = new Map<string, LynxiiLoggerImpl>()

    this.debug('logger created: %o', this.prefixData)
  }

  public on (event: 'message', listener: (message: string, data: any[]) => void): this
  public on (event: string, listener: (...data: any[]) => void): this {
    return super.on(event, listener)
  }

  public emit (event: 'message', message: string, data: any[]): boolean
  public emit (event: string, ...data: any[]): boolean {
    return super.emit(event, ...data)
  }

  public log (level: LoggingLevel, message: string, ...data: any[]): void {
    if (!this.enabled) return

    const formatted = format(message, ...data)
    if (level === LoggingLevel.DEBUG) this.debugger(message, data)
    else this.logger.log(LoggingLevel[level].toLowerCase(), formatted)
    this.emit('message', formatted, [ message ].concat(data))
  }

  public debug (message: string, ...data: any[]): void {
    this.log(LoggingLevel.DEBUG, message, ...data)
  }

  public verbose (message: string, ...data: any[]): void {
    this.log(LoggingLevel.VERBOSE, message, ...data)
  }

  public info (message: string, ...data: any[]): void {
    this.log(LoggingLevel.INFO, message, ...data)
  }

  public warn (message: string, ...data: any[]): void {
    this.log(LoggingLevel.WARN, message, ...data)
  }

  public error (message: string, ...data: any[]): void {
    this.log(LoggingLevel.ERROR, message, ...data)
  }

  public sublogger (prefix: string): LynxiiLoggerImpl {
    let l = this.subLoggers.get(prefix)

    if (!l) {
      l = new LynxiiLoggerImpl(prefix, this)
      this.subLoggers.set(prefix, l)
    }

    return l
  }
}
