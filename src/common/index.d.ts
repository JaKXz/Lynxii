/** A mapping of string keys to a specific value type */
declare interface TypedStringMap<T> {
  [key: string]: T
}

/** A mapping of string keys to any value */
declare interface StringMap extends TypedStringMap<any> { }

declare namespace Package {
  interface Root {
    /** The package's internal name */
    readonly name: string

    /** The semver-compatable version of the package */
    readonly version: string

    /** A non-localized description of the package */
    readonly description?: string

    /** The non-localized product name of this pacakge */
    readonly productName?: string

    /** Any package keysworks for NPM search */
    readonly keywords?: string[]

    /** The package's homepage, if it has one */
    readonly homepage?: string

    /** A tracker to report bugs too */
    readonly bugs?: string | Package.Bugs

    /** The license that this package is available under */
    readonly license?: string

    /** The author of the package */
    readonly author?: string | Package.Author

    /** Any additional contributors to the package */
    readonly contributors?: string[] | Package.Author[]

    /** An array of files to include in publishing */
    readonly files?: string[]

    /** The main execution script for the package */
    readonly main?: string

    /** Any binary commands available to the package */
    readonly bin?: string | TypedStringMap<string>

    /** Documentation for this pacakage */
    readonly man?: string | string[]

    /** The location of certain package directories */
    readonly directories?: Package.Directories

    /** The version control repository for this package */
    readonly repository?: string | Package.Repository

    /** The scripts for the package */
    readonly scripts?: TypedStringMap<string>

    /** The package's configuration data */
    readonly config?: Package.Config

    /** A mapping of the package dependencies to their versions */
    readonly dependencies?: TypedStringMap<string>

    /** A mapping of the package development-only dependencies to their versions */
    readonly devDependencies?: TypedStringMap<string>

    /** A mapping of the package peer dependencies to their versions */
    readonly peerDependencies?: TypedStringMap<string>

    /** A mapping of the package optional dependencies to their versions */
    readonly optionalDependencies?: TypedStringMap<string>

    /** An array of dependencies that come bundled */
    readonly bundledDependencies?: string[]

    /** The engines this package runs on */
    readonly engines?: Package.Engines

    /** The list of OSes this package runs on */
    readonly os?: string[]

    /** THe list of CPU architectures this pacakge runs on */
    readonly cpu?: string[]

    /** Whether or not this package prefers a global install */
    readonly preferGlobal?: boolean

    /** Whether or not this pacakge is private */
    readonly private?: boolean

    /** Speciallized configuration for publishing */
    readonly publishConfig?: Package.PublishConfig

    /** A list of workspace globs for yarn */
    readonly workspaces?: string[]
  }

  interface Author {
    /** The author's name */
    name: string

    /** The author's primary contact email */
    email?: string

    /** The author's user ID */
    id?: string

    /** The author's homepage URL */
    homepage?: string
  }

  interface Bugs {
    /** An email to send bugs to */
    email: string

    /** The URL to report bugs to */
    url: string
  }

  /** The location of certain package directories */
  interface Directories {
    lib?: string
    bin?: string
    man?: string
    doc?: string
    example?: string
  }

  /** The engines this package is designed for */
  interface Engines {
    node?: string
    npm?: string
  }

  /** The configuration data managed by NPM */
  interface Config {
    /** The NPM namespace for the config command */
    name?: string

    /** The configuration data */
    config?: StringMap
  }

  /** The publishing configuration this package */
  interface PublishConfig {
    registry?: string
  }

  /** A project repository */
  interface Repository {
    /** The type of repository */
    type: string

    /** The URL of the repository */
    url: string
  }
}

declare module '*/package.json' {
  const pkg: Package.Root
  export = pkg
}

declare module 'jsonpack' {
  export const pack: (json: string | object) => string
  export const unpack: (packed: string) => object
}
