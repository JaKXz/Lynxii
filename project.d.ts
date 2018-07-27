
/// <reference types="lynxii-common" />

declare interface IProjectBuildDirs {
  compiled: string
  target: string
}

declare interface IProjectBuildTarget {
  modes: ITypedStringMap<string>
}

declare interface IProjectBuild {
  output: string
  coverage: string
  dirs: IProjectBuildDirs
  targets: ITypedStringMap<IProjectBuildTarget>
}

declare interface IProjectLicense {
  extensions: string[]
}

declare interface IProjectModules {
  forwards: string[]
  overrides: ITypedStringMap<IStringMap>
  scripts: ITypedStringMap<ITypedStringMap<string>>
  config: ITypedStringMap<IStringMap>
  links: ITypedStringMap<string[]>
}

declare interface IProject {
  build: IProjectBuild
  license: IProjectLicense
  modules: IProjectModules
}
