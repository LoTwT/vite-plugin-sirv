import sirv from "sirv"
import { lookup } from "mrmime"
import { composeFunctions } from "@ayingott/sucrose"
import type { Options as SirvOptions } from "sirv"
import type { Plugin, PreviewServerForHook, ViteDevServer } from "vite"

const defaultConfig: VitePluginSirvConfig = {
  route: "/",
  enforce: "pre",
  options: {
    setHeaders: (res, pathname) => {
      if (!lookup(pathname)) {
        res.setHeader("content-type", "text/plain")
      }
    },
  },
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
        ...defaultConfig.options,
        dev: configResolved.mode === "development",
      }
      resolvedConfig = {
        ...defaultConfig,
        ...config,
        options: {
          ...defaultConfig.options,
          ...config.options,
          setHeaders: composeFunctions(
            defaultConfig?.options?.setHeaders,
            config?.options?.setHeaders,
          ),
        },
      }
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
