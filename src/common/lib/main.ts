
/// <reference path="../index.d.ts" />

import { EventEmitter } from 'events'

import { ILynxiiLogger } from './logger'

/**
 * The main process class
 * @author Matthew Struble <matt@vevox.io>
 */
export default class ProcessMain extends EventEmitter {
  /** The package.json for this process */
  public readonly package: Package.IRoot

  /** The process's working directory */
  public readonly cwd: string

  private readonly logger: ILynxiiLogger

  constructor (pkg: Package.IRoot, cwd: string, logger: ILynxiiLogger) {
    super()
    this.package = pkg
    this.cwd = cwd

    this.logger = logger
  }

  public on (event: 'error', listener: (err: Error) => void): this
  public on (event: string, listener: (...data: any[]) => void): this {
    return super.on(event, listener)
  }

  public once (event: 'ready', listener: () => void): this
  public once (event: string, listener: (...data: any[]) => void): this {
    return super.once(event, listener)
  }

  public emit (event: 'error', error: Error): boolean
  public emit (event: 'ready'): boolean
  public emit (event: string, ...data: any[]): boolean {
    this.logger.debug('event [%s]: %o', event, data)
    return super.emit(event, ...data)
  }

  public async start (): Promise<void> {
    await this.onStart()
    this.emit('ready')
  }

  public async onStart (): Promise<void> {
    // no-op
  }
}
