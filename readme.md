# Laravel Mix CSS Partial

![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)
[![Latest Version on NPM](https://img.shields.io/npm/v/laravel-mix-css-partial.svg?style=flat-square)](https://npmjs.com/package/laravel-mix-css-partial)

This package adds a `cssPartial` option to Laravel Mix, which copy css code into partial file.
## Usage

First, install the extension.

```
npm install laravel-mix-css-partial --save-dev
```

Then, require it within your `webpack.mix.js` file:

```js
let mix = require('laravel-mix');

require('laravel-mix-css-partial');

mix.cssPartial('css/gallery.scss', 'partials/gallery-css.php');
```
\
If you are using `setPublicPath` option in your mix file then declare `setPublicPath` option before `cssPartial` option.

```js
mix.setPublicPath('dist').cssPartial('css/gallery.scss', 'partials/gallery-css.php');
```

##### Supported Source file types:
`.css` `.scss` `.sass`