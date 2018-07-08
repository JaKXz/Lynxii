export namespace Core {
  /** An enumeration of exit codes */
  export enum ExitCode {
    OK = 0,

    /** An exception that was raised somewhere in operation and is unrecoverable */
    UNCAUGHT_FATAL_EXCEPTION = 1000,

    /** The configuraiton could not be loaded */
    CONFIGURATION_LOADING_FAILED,

    /** The mods could not be installed */
    DATABASE_DESERIALIZATION_FAILED,

    /** An operation is unsupported or otherwise unavailable */
    UNSUPPORTED_OPERATION
  }
}

/** Constant data for Horizon's Core */
export namespace Constants {
  /** The current fallback language if the primary fails */
  export const FALLBACK_LANG = 'en_US'

  /** The maximum number of log files */
  export const MAX_LOG_FILES = 4

  /** Patterns for matching specific errors */
  export namespace ErrorPatterns {
    export const ENOENT = /^ENOENT/
  }

  /** Paths and directory names */
  export namespace Directories {
    /** The dedicated server's data directory */
    export const SERVER_DATA = 'data'

    /** The logs directory */
    export const LOGS = 'log'

    /** The directory where configuration is stored */
    export const CONFIG = 'cfg'
  }

  /** File names */
  export namespace Files {
    /** The package manifest file */
    export const PACKAGE = 'package.json'

    /** The primary configuration file */
    export const CONFIG = 'config.json'

    /** Server log files */
    export const SERVER_LOG = 'server.log'
  }
}
