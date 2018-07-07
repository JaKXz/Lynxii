import { default as BlockMap } from 'lynxii-server/map'
import { default as Block } from 'lynxii-server/block'
import { expect } from 'chai'
import * as util from 'lynxii-server/util'
import 'mocha'

describe('server/map/index', function () {
  describe('BlockMap', function () {
    const genericMapID = util.generateUniqueID()
    const genericMap = new BlockMap(genericMapID)

    describe('static deserialize()', function () {
      it('should create a new map object', function () {
        const map = BlockMap.deserialize({
          _serializationID: BlockMap.name,
          id: genericMapID,
          blocks: [ ]
        })

        expect(map.id).to.equal(genericMapID)
        expect(map.blockCount).to.equal(0)
      })

      it('should throw a DeserializationError if the serialID is bad', function () {
        expect(() => BlockMap.deserialize({ })).to.throw(util.DeserializationError)
        expect(() => BlockMap.deserialize({ _serializationID: 'foo' })).to.throw(util.DeserializationError)
      })

      it('should add blocks from the data', function () {
        const blockID = util.generateUniqueID()
        const map = BlockMap.deserialize({
          _serializationID: BlockMap.name,
          id: genericMapID,
          blocks: [
            {
              _serializationID: 'Block',
              id: blockID
            }
          ]
        })

        expect(map.id).to.equal(genericMapID)
        expect(map.blockCount).to.equal(1)
        expect(map.get(blockID)).to.exist.and.to.have.property('id', blockID)

        const data = map.serialize()
        expect(data.blocks.length).to.equal(1)
        expect(data.blocks[0].id).to.equal(blockID)
      })
    })

    describe('<init>', function () {
      it('should generate a UUID if none is provided', function () {
        const map = new BlockMap()
        expect(map.id).to.be.a('string')
      })

      it('should accept any string given as a UUID', function () {
        expect(genericMap.id).to.equal(genericMapID)
      })
    })

    describe('addBlock()', function () {
      it('should add a block to the map', function () {
        const map = new BlockMap
        map.addBlock(new Block(genericMapID))
        expect(map.blockCount).to.equal(1)
        expect(map.get(genericMapID)).to.exist.and.have.property('id', genericMapID)
      })

      it('should fail for double-additions of the same block', function () {
        const map = new BlockMap
        const block = new Block(genericMapID)
        map.addBlock(block)

        expect(() => map.addBlock(block)).to.throw(/^Block\[/)
      })
    })

    describe('serialize()', function () {
      it('should return an object with the correct IDs', function () {
        const serialized = genericMap.serialize()
        expect(serialized._serializationID).to.equal('BlockMap')
        expect(serialized.id).to.equal(genericMapID)
      })
    })
  })
})
