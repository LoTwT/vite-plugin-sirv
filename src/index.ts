import type { Plugin, PreviewServerForHook, ViteDevServer } from "vite"
import type { Options as SirvOptions } from "sirv"
import sirv from "sirv"
import { defu } from "defu"

const defaultConfig: VitePluginSirvConfig = {
  route: "/",
  enforce: "pre",
  options: {},
}

export interface VitePluginSirvConfig {
  /**
   * base route
   * @default "/"
   */
  route?: string
  /**
   * when sirv is used in configServer
   * @default "pre"
   */
  enforce?: "pre" | "post"
  /**
   * assets dir
   */
  dir?: string
  /**
   * sirv options
   */
  options?: SirvOptions
}

export default function (config: VitePluginSirvConfig): Plugin {
  let resolvedConfig: VitePluginSirvConfig

  return {
    name: "vite-plugin-sirv",

    configResolved: (configResolved) => {
      defaultConfig.options = {
        dev: configResolved.mode === "development",
      }
      resolvedConfig = defu(config, defaultConfig)
    },

    configureServer: (server) => {
      if (resolvedConfig.enforce === "post")
        return () => {
          useSirv(server, resolvedConfig)
        }
      else useSirv(server, resolvedConfig)
    },

    configurePreviewServer: (server) => {
      if (resolvedConfig.enforce === "post")
        return () => {
          useSirv(server, resolvedConfig)
        }
      else useSirv(server, resolvedConfig)
    },
  }
}

function useSirv(
  server: ViteDevServer | PreviewServerForHook,
  config: VitePluginSirvConfig,
) {
  server.middlewares.use(
    normalizeRoute(config.route),
    sirv(config.dir, config.options),
  )
}

function normalizeRoute(route?: string) {
  if (!route) return "/"

  return route.startsWith("/") ? route : `/${route}`
}
