import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import VitePluginSirv from "vite-plugin-sirv"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePluginSirv({
      dir: "src/components",
      route: "raw",
    }),
    vue(),
  ],
})
