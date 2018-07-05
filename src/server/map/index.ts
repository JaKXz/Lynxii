import Block from '../block/block'
import { Serializeable, SerializedObject } from '../util/serializeable'

import { generateUniqueID } from '../util'

/** A Lynxii map */
export default class BlockMap implements Serializeable {
  static deserialize (data: any): BlockMap {
    if (!isBlockMap(data)) throw new Error('Data is not a valid BlockMap')
    const map = new BlockMap(data.id)
    for (const block of data.blocks) map.addBlock(block)
    return map
  }

  /** The unique ID for this map */
  readonly id: string

  private readonly blockMap: Map<string, Block> = new Map

  constructor (id: string = generateUniqueID()) {
    this.id = id
  }

  private addBlock (block: Block) {
    const { uuid } = block
    if (this.blockMap.has(uuid)) throw new Error(`${block.toString()} already exists in ${this.toString()}`)
    this.blockMap.set(uuid, block)
  }

  serialize (): SerializedBlockMap {
    const { id } = this
    const blocks: Block[] = [ ]
    // TODO serialize blocks

    return {
      _serializationID: BlockMap.constructor.name,
      id,
      blocks
    }
  }

  toString(): string {
    return `BlockMap[${this.id}]`
  }
}

export interface SerializedBlockMap extends SerializedObject {
  id: string
  blocks: Block[]
}

/** A typeguard function that checks the serialized block map */
export function isBlockMap (data: any): data is SerializedBlockMap {
  return data._serializationID && data._serializationID === BlockMap.constructor.name
}
