// @ts-check

const { defineFlatConfig } = require("@ayingott/eslint-config")

module.exports = defineFlatConfig(
  [
    {
      rules: {
        "import/no-default-export": "off",
        "jsonc/comma-dangle": "off",
      },
    },
  ],
  {
    prettier: true,
    vue: false,
    react: false,
    unocss: false,
  },
)
