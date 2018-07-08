import { expect } from 'chai'
import 'mocha'

import logger from 'lynxii-core/util/logger'

describe('core/util/logger', function () {
  describe('globalLogger', function () {
    it('should log in different ways', function () {
      logger.silly('test log')
      logger.writeOut('stdout')
      logger.writeErr('stderr')
    })

    it('should create a sub-logger', function () {
      const subLogger = logger.createSublogger('foo')
      expect(subLogger.namespace === 'foo')
      subLogger.silly('test sub log')
    })
  })
})
