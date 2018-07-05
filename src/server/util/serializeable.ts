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
