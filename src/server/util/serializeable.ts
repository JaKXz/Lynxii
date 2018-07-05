/** An object that can be serialized into JSON */
export default interface Serializeable {
  serialize (): StringMap
}
