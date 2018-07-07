import { EventEmitter } from 'events'
import * as util from '../util'

/** A Lynxii block object */
export default class Block extends EventEmitter implements util.Serializeable, util.UniquelyIdentifiable {
  /** Attempt to deserialize the given data into a block */
  static deserialize (data: any): Block {
    if (!util.isDeserializableTo<SerializedBlock>(data, Block.name)) throw new util.DeserializationError(Block.name)

    const block = new Block(data.id)
    return block
  }

  public readonly id: string

  constructor (id: string = util.generateUniqueID()) {
    super()
    this.id = id
  }

  serialize (): SerializedBlock {
    const { id } = this

    return {
      _serializationID: Block.name,
      id
    }
  }
}

/** A serialized block */
export interface SerializedBlock extends util.SerializedObject {
  id: string
}
