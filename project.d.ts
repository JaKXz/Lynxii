
/// <reference path="./index.d.ts" />

declare interface ProjectBuildDirs {
  compiled: string
  target: string
}

declare interface ProjectBuildTarget {
  modes: string[]
}

declare interface ProjectBuild {
  output: string
  dirs: ProjectBuildDirs
  targets: TypedStringMap<ProjectBuildTarget>
}

declare interface Project {
  build: ProjectBuild
}
