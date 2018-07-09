import { promises as fs, constants as fsConst } from 'fs'
import { pack, unpack } from 'jsonpack'
import * as util from './'

export default class LynxiiDatabase implements util.Serializeable {
  /** The file extension used in the database */
  static readonly EXTENSION = 'ldb'

  /** The default database name */
  static readonly DEFAULT_NAME = 'primary.' + LynxiiDatabase.EXTENSION

  /** Dataase file encoding */
  static readonly FILE_ENCODING = 'utf8'

  static readonly DATABASE_FLAGS = fsConst.O_RDWR | fsConst.O_CREAT

  static async open (file: string): Promise<LynxiiDatabase> {
    const handle = await fs.open(file, LynxiiDatabase.DATABASE_FLAGS)

    const db = new LynxiiDatabase(handle)
    await db.read()

    return db
  }

  private readonly handle: fs.FileHandle

  constructor (handle: fs.FileHandle) {
    this.handle = handle
  }

  async read (): Promise<void> {
    const data = unpack(await this.handle.readFile('utf8'))
    if (!util.isDeserializableTo<SerializedDatabase>(data, LynxiiDatabase.name)) throw new util.DeserializationError(LynxiiDatabase.name)

    // TODO actually do a thing
  }

	serialize (): SerializedDatabase {
		return {
      _serializationID: LynxiiDatabase.name
    }
	}

  async write (): Promise<void> {
    const packed = pack(this.serialize())
    await this.handle.write(new Buffer(packed, LynxiiDatabase.FILE_ENCODING))
  }
}

export interface SerializedDatabase extends util.SerializedObject {

}
