import * as util from 'lynxii-server/util'

import { expect } from 'chai'
import 'mocha'

enum TestEnum {
  FOO,
  BAR,
  BAZ
}

describe('server/util/index', function () {
  describe('DerivedError', function () {
    describe('<init>', function () {
      const err = new Error('test error')
      const der = new util.DerivedError('test derived error', err)

      it('should be caused by the given error', function () {
        expect(der.cause).to.equal(err)
      })

      it('should create a double stack', function () {
        expect(der.stack.length).to.be.greaterThan(err.stack.length)
      })

      it('should behave as a normal error without a cause', function () {
        const msg = 'test derived error without cause'
        const der2 = new util.DerivedError(msg)

        expect(der2.message).to.equal(msg)
        expect(der2.cause).to.be.undefined
      })
    })
  })

  describe('noop()', function () {
    it('should do nothing', function () {
      expect(util.noop()).to.be.undefined
    })
  })

  describe('getEnumKeys()', function () {
    it('should return an array of strings', function () {
      const keys = util.getEnumKeys(TestEnum)

      expect(keys).to.be.an.instanceOf(Array)
      expect(keys.length).to.equal(3)
      expect(keys[0]).to.equal('FOO')
      expect(keys[1]).to.equal('BAR')
      expect(keys[2]).to.equal('BAZ')
    })
  })

  describe('generateUniqueID()', function () {
    it('should return a string in UUID v4 format', function () {
      const uuid = util.generateUniqueID()

      expect(uuid).to.be.a('string')
      expect(uuid).to.match(util.idFormat)
    })
  })
})
