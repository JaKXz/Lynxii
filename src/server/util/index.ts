import { v4 as generateUUID } from 'uuid'
import createDebugLogger from './debug'

const _debug = createDebugLogger('util')

/** A point in space (or, in this case, on a map) */
export interface Point {
  /** The X value of the position */
  x: number,

  /** The Y value of the position */
  y: number
}

/** An error that was caused by another */
export class DerivedError extends Error {
  /** The error that caused this one */
  public readonly cause: Error

  /** Constructs a new error as normal, but appends the given error as a "cause" */
  constructor (msg: string, cause?: Error) {
    super(msg)

    if (cause) {
      cause.stack = 'Caused by: ' + cause.stack
      const pat = /^.+$/gm

      let line: RegExpExecArray
      while (line = pat.exec(msg)) this.stack += '    ' + line + '\n'

      this.cause = cause
    }
  }
}

/** A void-returning function that does nothing */
export function noop () { }

/** Gets the keys from the given enum */
export function getEnumKeys (enumValues): Array<string> {
  const keys = Object.keys(enumValues)
  return keys.slice(keys.length / 2)
}

/** The format for unique IDs */
export const idFormat = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

/** Generates a unique v4 UUID */
export function generateUniqueID (): string {
  const id = generateUUID()
  _debug('generate unique ID %s', id)
  return id
}

/** An object that has a unique ID */
export interface UniquelyIdentifiable {
  /** A unique ID */
  id: string
}

/** An object that can be serialized into JSON */
export interface Serializeable {
  /** Serializes this object into JSON */
  serialize (): StringMap
}

/** An object that contains serialized data for a Lynxii object */
export interface SerializedObject {
  /** The constructor ID for the Lynxii object */
  _serializationID: string
}

export class DeserializationError extends Error {
  constructor (name: string) {
    super('Given data cannot be deserialized into ' + name)
  }
}

/** Determines if the given data can be deserialized to the given type */
export function isDeserializableTo<T extends SerializedObject> (data: any, serialID: string): data is T {
  return data._serializationID === serialID
}
