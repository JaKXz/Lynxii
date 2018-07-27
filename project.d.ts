
/// <reference types="lynxii-common" />

declare interface ProjectBuildDirs {
  compiled: string
  target: string
}

declare interface ProjectBuildTarget {
  modes: TypedStringMap<string>
}

declare interface ProjectBuild {
  output: string
  coverage: string
  dirs: ProjectBuildDirs
  targets: TypedStringMap<ProjectBuildTarget>
}

declare interface ProjectLicense {
  extensions: string[]
}

declare interface ProjectModules {
  forwards: string[]
  overrides: TypedStringMap<StringMap>
  scripts: TypedStringMap<TypedStringMap<string>>
  config: TypedStringMap<StringMap>
  links: TypedStringMap<string[]>
}

declare interface Project {
  build: ProjectBuild
  license: ProjectLicense
  modules: ProjectModules
}
