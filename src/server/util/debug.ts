///<reference path="../../../index.d.ts"/>
import * as debug from 'debug'
import * as pkg from '../package.json'

/**
  * Creates a new debug logger
  * @param prefix - The prefix to use for the logger
  */
export default function createDebugLogger (...prefix: string[]): debug.IDebugger {
  return debug([pkg.name].concat(prefix).join(':'))
}
