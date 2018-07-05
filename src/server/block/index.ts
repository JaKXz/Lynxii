import { Serializeable, SerializedObject, UniquelyIdentifiable, generateUniqueID } from '../util'
import { EventEmitter } from 'events'

/** A Lynxii block object */
export default class Block extends EventEmitter implements Serializeable, UniquelyIdentifiable {
  public readonly id: string

  constructor (id: string = generateUniqueID()) {
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
export interface SerializedBlock extends SerializedObject {
  id: string
}

export function isBlock (data: any): data is Block {
  return data._serializationID && data._serializationID === Block.name
}
