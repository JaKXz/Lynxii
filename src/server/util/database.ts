import { promises as fs, constants as fsConst } from 'fs'
import { default as globalLogger, Logger } from 'lynxii-core/util/logger'
import { pack, unpack } from 'jsonpack'
import { dirname, basename } from 'path'
import { Constants } from 'lynxii-core'
import * as util from './'

const logger = globalLogger.createSublogger('db')
const _debug = globalLogger.createDebugger('database')

export default class LynxiiDatabase implements util.Serializeable {
  /** The file extension used in the database */
  static readonly EXTENSION = 'ldb'

  /** The default database name */
  static readonly DEFAULT_NAME = 'primary.' + LynxiiDatabase.EXTENSION

  /** Dataase file encoding */
  static readonly FILE_ENCODING = 'utf8'

  /** Flags for the file opening */
  static readonly DATABASE_FLAGS = fsConst.O_RDWR | fsConst.O_CREAT

  /** Opens the database at the given file path */
  static async open (file: string): Promise<LynxiiDatabase> {
    logger.info('opening ' + file)
    const dir = dirname(file)
    try {
      const stats = await fs.stat(dir)
      _debug('existing dir, mode %s (need %s)', stats.mode.toString(8), fsConst.S_IFDIR.toString(8))
      if (!(stats.mode & fsConst.S_IFDIR)) throw new Error('ENOTDIR: ' + dir)
    } catch (err) {
      if (err.message.match(Constants.ErrorPatterns.ENOENT)) {
        await fs.mkdir(dir)
        _debug('dir missing, created')
      }
      else throw err
    }

    const handle = await fs.open(file, LynxiiDatabase.DATABASE_FLAGS)
    return new LynxiiDatabase(basename(file, '.' + LynxiiDatabase.EXTENSION), handle, await handle.readFile())
  }

  /** The database's name */
  public readonly name: string

  /** The date this database was created */
  public readonly created: Date

  private readonly handle: fs.FileHandle
  private readonly logger: Logger

  constructor (name: string, handle: fs.FileHandle, buff: Buffer) {
    this.handle = handle
    this.name = name
    this.logger = logger.createSublogger(name)

    if (buff.length) {
      this.logger.info('loading existing database')
      const data = unpack(buff.toString(LynxiiDatabase.FILE_ENCODING))
      if (!util.isDeserializableTo<SerializedDatabase>(data, LynxiiDatabase.name)) {
        throw new util.DeserializationError(LynxiiDatabase.name)
      }

      this.created = new Date(data.created)
    } else {
      this.logger.info('creating new database')
      this.created = new Date
    }
  }

  /** A string representation of the date this database was created */
  get createdString (): string {
    return this.created.toISOString()
  }

	serialize (): SerializedDatabase {
		return {
      _serializationID: LynxiiDatabase.name,
      created: this.createdString
    }
	}

  async write (): Promise<void> {
    this.logger.info('writing out')
    const packed = pack(this.serialize())
    await this.handle.write(new Buffer(packed, LynxiiDatabase.FILE_ENCODING))
  }

  close (): Promise<void> {
    this.logger.info('closed')
    return this.handle.close()
  }
}

export interface SerializedDatabase extends util.SerializedObject {
  created: string
}
