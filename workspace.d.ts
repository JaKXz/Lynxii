///<reference path="./index.d.ts"/>

declare interface Project {
  /** A list of extensions to apply the license header to */
  licenseExtensions: string[]

  /** A list of keys from the root package that are forwarded verbatim to the project packages */
  forwardedPackageKeys: string[]

  /** A mapping of projects to default configuration objects */
  defaultConfig: TypedStringMap<StringMap>

  /** A mapping of projects to literal key overrides */
  overridePackageKeys: TypedStringMap<StringMap>
}

declare module '*/project.json' {
  const project: Project
  export = project
}
