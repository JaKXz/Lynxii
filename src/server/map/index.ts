import Block from '../block/block'
import Serializeable from '../util/serializeable'

import { generateUniqueID } from '../util'

/** A Lynxii map */
export default class BlockMap implements Serializeable {
  static deserialize (data: SerializedBlockMap): BlockMap {
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

  serialize (): StringMap {
    const { id } = this
    // TODO serialize blocks

    return {
      id
    }
  }

  toString(): string {
    return `BlockMap[${this.id}]`
  }
}

export interface SerializedBlockMap {
  id: string
  blocks: Block[]
}
