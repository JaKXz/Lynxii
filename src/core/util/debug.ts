/// <reference types="debug" />
import * as debug from 'debug'
import * as pkg from '../package.json'

export interface Debugger {
  (msg: string, ...data: any[]): void

  /** The debug namespace */
  namespace: string
}

export type DebuggerInitializer = (name: string, ...ns: string[]) => Debugger

/** Creates a new debug logger for the core package */
export default function createDebugger (name: string, ...ns: string[]): Debugger {
  return createDebuggerFor(pkg.name, ...[ name ].concat(ns))
}

/** Creates a debug logger for the given package */
export function createDebuggerFor (packageName: string, ...ns: string[]): Debugger {
  return debug([packageName].concat(ns).join(':'))
}
