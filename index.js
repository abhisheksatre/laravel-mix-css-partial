const mix = require('laravel-mix');
const fs = require('fs');
const assert = require('assert');
const Path = require('path');
const CssPartialTask = require('./css-partial-task');


class cssPartial{

    name() {
        return ['cssPartial', 'csspartial'];
    }

    register(src, partialPath, pluginOptions = {}, postCssPlugins = []) {

        assert(typeof src === 'string', `mix.cssPartial() is missing required parameter 1: src`);
        assert(typeof partialPath === 'string', `mix.cssPartial() is missing required parameter 2: partialPath`);
        assert(fs.existsSync(src) === true, `src file "${src}" doesn't exist`);
        assert(fs.existsSync(partialPath) === true, `partial file "${partialPath}" doesn't exist`);

        const fileType = Path.extname(src).toLowerCase();
        assert(['.css', '.sass', '.scss', '.less', '.styl'].indexOf(fileType) !== -1, `Source file type "${fileType}" is not supported for CSS partial`);

        Mix.addTask(new CssPartialTask({
            src: src,
            partialPath: partialPath,
            mix: mix,
            pluginOptions: pluginOptions,
            postCssPlugins: postCssPlugins
        }));
    }
}

mix.extend('cssPartial', new cssPartial());
