import { default as Block, SerializedBlock } from '../block'
import * as util from '../util'

/** A Lynxii map */
export default class BlockMap extends util.LynxiiObject implements util.Serializeable, util.UniquelyIdentifiable {
  /** Attempt to deserialize the given data into a map */
  static deserialize (data: any): BlockMap {
    if (!util.isDeserializableTo<SerializedBlockMap>(data, BlockMap.name)) throw new util.DeserializationError(BlockMap.name)

    const map = new BlockMap(data.id)
    for (const block of data.blocks) map.addBlock(Block.deserialize(block))
    return map
  }

  private readonly blockMap: Map<string, Block> = new Map

  constructor (id: string = util.generateUniqueID()) {
    super(id)
  }

  /** The number of blocks this map has */
  get blockCount (): number {
    return this.blockMap.size
  }

  addBlock (block: Block) {
    const { id } = block
    if (this.blockMap.has(id)) throw new Error(`${block.toString()} already exists in ${this.toString()}`)
    this.blockMap.set(id, block)
  }

  /** Gets the block by the given ID */
  get (id: string): Block | undefined {
    return this.blockMap.get(id)
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
}

export interface SerializedBlockMap extends util.SerializedObject {
  id: string
  blocks: SerializedBlock[]
}
