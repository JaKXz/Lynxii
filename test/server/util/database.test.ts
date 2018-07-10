import { join } from 'path'
import LynxiiDatabase from 'lynxii-server/util/database'
import * as fs from 'fs'
import * as mock from 'mock-fs'

import { expect } from 'chai'
import 'mocha'

beforeEach(function () {
  mock({
    'data': { },
    'mock.txt': 'mock'
  })
})
afterEach(function () {
  mock.restore()
})

describe('server/util/database', function () {
  describe('LynxiiDatabase', function () {
    describe('static open()', function () {
      it('should create the default file in an existing directory', async function () {
        const file = join('data', LynxiiDatabase.DEFAULT_NAME)
        await LynxiiDatabase.open(file)

        const stats = fs.statSync(file)
        expect(stats.mode & fs.constants.S_IFREG).to.not.equal(0)
      })
    })
  })
})
