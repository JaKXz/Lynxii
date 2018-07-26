
import { EventEmitter } from 'events'

/**
 * A logging utility for Lynxii
 * @author Matthew Struble <matt@vevox.io>
 */
export default class LynxiiLogger extends EventEmitter {
  /** The logger's prefix */
  public readonly prefix: string

  /** The logger's parent */
  public readonly parent?: LynxiiLogger

  private readonly prefixData: string[]

  /**
   * Creates a top-level logger with no prefix
   */
  public constructor ()

  /**
   * Creates a new logger from the given prefix and parent
   * @param prefix The prefix to use
   * @param parent The parent to use, if any
   */
  public constructor (prefix: string, parent: LynxiiLogger)

  public constructor (prefix?: string, parent?: LynxiiLogger) {
    super()

    this.prefixData = prefix ? parent.prefixData.concat(prefix) : []

    this.prefix = this.prefixData.join(':')
    this.parent = parent
  }

}
