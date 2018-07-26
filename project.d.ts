
/// <reference path="./index.d.ts" />

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

declare interface Project {
  build: ProjectBuild
}
