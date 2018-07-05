import BlockMap from 'lynxii-server/map'

import { expect } from 'chai'
import 'mocha'

describe('server/map/index', function () {
  describe('BlockMap', function () {
    const genericMapID = 'generic-foo'
    const genericMap = new BlockMap(genericMapID)

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

    })

    describe('serialize()', function () {
      it('should return an object with the correct IDs', function () {
        const serialized = genericMap.serialize()
        expect(serialized._serializationID).to.equal('BlockMap')
        expect(serialized.id).to.equal(genericMapID)
      })
    })

    describe('toString()', function () {
      it('should return the correct string', function () {
        expect(genericMap.toString()).to.equal('BlockMap[generic-foo]')
      })
    })
  })
})
