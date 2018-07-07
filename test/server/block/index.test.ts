import { default as Block } from 'lynxii-server/block'
import { expect } from 'chai'
import * as util from 'lynxii-server/util'
import 'mocha'

describe('server/block/index', function () {
  describe('Block', function () {
    const genericBlockID = util.generateUniqueID()
    const genericBlock = new Block(genericBlockID)

    describe('static deserialize()', function () {
      it('should create a new map object', function () {
        const map = Block.deserialize({
          _serializationID: Block.name,
          id: genericBlockID,
          blocks: [ ]
        })

        expect(map.id).to.equal(genericBlockID)
      })

      it('should throw a DeserializationError if the serialID is bad', function () {
        expect(() => Block.deserialize({ })).to.throw(util.DeserializationError)
        expect(() => Block.deserialize({ _serializationID: 'foo' })).to.throw(util.DeserializationError)
      })
    })

    describe('<init>', function () {
      it('should generate a UUID if none is provided', function () {
        const map = new Block
        expect(map.id).to.be.a('string')
      })

      it('should accept any string given as a UUID', function () {
        expect(genericBlock.id).to.equal(genericBlockID)
      })
    })

    describe('serialize()', function () {
      it('should return an object with the correct IDs', function () {
        const serialized = genericBlock.serialize()
        expect(serialized._serializationID).to.equal('Block')
        expect(serialized.id).to.equal(genericBlockID)
      })
    })
  })
})
