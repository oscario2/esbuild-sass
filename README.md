# esbuild-sass
A plugin for `esbuild` to compile `sass` using the portable dart binary directly. Works with any `build` configuration.

## Usage
Ensure the `sass` binary is in `%PATH%` or `$PATH`. Register the plugin and import your styles. 


```js
// esbuild.js
import { build } from "esbuild";
import sass from "esbuild-sass";

build({
    ...
    plugins: [sass]
    ...
})

// index.(ts|tsx|js)
import "./style.scss"
```

## Notes
The `.css` output folder is `tmpdir()/MD5($ESBUILD_CWD)` and maintains the directory hierarchy of your source files.
