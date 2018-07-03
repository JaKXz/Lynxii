///<reference path="./index.d.ts"/>

declare module '*/package.json' {
  interface RootPackage extends Package.Root {
    /** The project data */
    project: RootPackageProject
  }

  interface RootPackageProject {
    /** A list of extensions to apply the license header to */
    licenseExtensions: string[]

    /** A list of keys from the root package that are forwarded verbatim to the project packages */
    forwardedPackageKeys: string[]

    /** A mapping of projects to default configuration objects */
    defaultConfig: TypedStringMap<StringMap>

    /** A mapping of projects to literal key overrides */
    overridePackageKeys: TypedStringMap<StringMap>
  }

  const rootPackage: RootPackage
  export = rootPackage
}
