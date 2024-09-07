import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
  //ignore node_modules and build folder
  {ignores: ["node_modules/", "dist/"]},

];