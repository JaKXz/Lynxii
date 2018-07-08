import * as util from '../util'
import logger from 'lynxii-core/util/logger'

const _debug = logger.createDebugger('block')

/** A Lynxii block object */
export default class Block extends util.LynxiiObject implements util.Serializeable, util.UniquelyIdentifiable {
  static EVENT_RECV_NODE = Symbol('recv-node')
  static EVENT_RECV_FIELD = Symbol('recv-field')
  static EVENT_RECV_CMD = Symbol('recv-cmd')
  static EVENT_UPDATE_NODE = Symbol('update-node')
  static EVENT_UPDATE_FIELD = Symbol('update-field')

  /** Attempt to deserialize the given data into a block */
  static deserialize (data: any): Block {
    if (!util.isDeserializableTo<SerializedBlock>(data, Block.name)) throw new util.DeserializationError(Block.name)

    const block = new Block(data.id)
    return block
  }

  constructor (id: string = util.generateUniqueID()) {
    super(id)
    _debug('create block %s', id)
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
