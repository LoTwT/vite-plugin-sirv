import type { Plugin } from "vite"
import type { Options as SirvOptions } from "sirv"
import sirv from "sirv"

export interface VitePluginSirvConfig {
  dir: string
  sirvOptions?: SirvOptions
}

export default function (config: VitePluginSirvConfig): Plugin {
  let resolvedSirvOptions = config.sirvOptions ?? {}

  return {
    name: "vite-plugin-sirv",

    configResolved: (config) => {
      resolvedSirvOptions = {
        ...resolvedSirvOptions,
        dev: config.mode === "serve",
      }
    },

    configureServer: (server) => {
      return () => {
        server.middlewares.use(sirv(config.dir, resolvedSirvOptions))
      }
    },
  }
}
