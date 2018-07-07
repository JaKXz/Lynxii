import { default as Block, SerializedBlock } from '../block'
import { EventEmitter } from 'events'
import * as util from '../util'

/** A Lynxii map */
export default class BlockMap extends EventEmitter implements util.Serializeable, util.UniquelyIdentifiable {
  /** Attempt to deserialize the given data into a map */
  static deserialize (data: any): BlockMap {
    if (!util.isDeserializableTo<SerializedBlockMap>(data, BlockMap.name)) throw new util.DeserializationError(BlockMap.name)

    const map = new BlockMap(data.id)
    for (const block of data.blocks) map.addBlock(Block.deserialize(block))
    return map
  }

  /** The unique ID for this map */
  readonly id: string

  private readonly blockMap: Map<string, Block> = new Map

  constructor (id: string = util.generateUniqueID()) {
    super()
    this.id = id
  }

  private addBlock (block: Block) {
    const { id } = block
    if (this.blockMap.has(id)) throw new Error(`${block.toString()} already exists in ${this.toString()}`)
    this.blockMap.set(id, block)
  }

  serialize (): SerializedBlockMap {
    const { id } = this
    const blocks: SerializedBlock[] = [ ]
    for (const block of this.blockMap.values()) blocks.push(block.serialize())

    return {
      _serializationID: BlockMap.name,
      id,
      blocks
    }
  }

  toString(): string {
    return `BlockMap[${this.id}]`
  }
}

export interface SerializedBlockMap extends util.SerializedObject {
  id: string
  blocks: SerializedBlock[]
}

/** A typeguard function that checks the serialized block map */
export function isBlockMap (data: any): data is SerializedBlockMap {
  return data._serializationID && data._serializationID === BlockMap.name
}
