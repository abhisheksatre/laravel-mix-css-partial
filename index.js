const mix = require('laravel-mix');
const fs = require('fs');
const assert = require('assert');
const CssPartialTask = require('./css-partial-task');


class cssPartial{

    name() {
        return ['cssPartial', 'csspartial'];
    }

    register(src, partialPath) {

        assert(typeof src === 'string', `mix.cssPartial() is missing required parameter 1: src`);
        assert(typeof partialPath === 'string', `mix.cssPartial() is missing required parameter 2: partialPath`);
        assert(fs.existsSync(src) === true, `src file "${src}" doesn't exist`);
        assert(fs.existsSync(partialPath) === true, `partial file "${partialPath}" doesn't exist`);

        Mix.addTask(new CssPartialTask({
            src: src,
            partialPath: partialPath,
            mix: mix
        }));
    }
}

mix.extend('cssPartial', new cssPartial());