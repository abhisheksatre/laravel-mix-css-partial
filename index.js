const mix = require('/Users/abhishek.sat/Sites/auto/wp-content/themes/autos/node_modules/laravel-mix/src/index');
const fs = require('fs');
const Os = require('os');
const Path = require('path');
const assert = require('assert');


class cssPartial{

    name() {
        return ['cssPartial', 'csspartial'];
    }

    register(src, partialPath) {

        assert(typeof src === 'string', `mix.cssPartial() is missing required parameter 1: src`);
        assert(typeof partialPath === 'string', `mix.cssPartial() is missing required parameter 2: partialPath`);
        assert(fs.existsSync(src) === true, `src file "${src}" doesn't exist`);
        assert(fs.existsSync(partialPath) === true, `partial file "${partialPath}" doesn't exist`);

        this.src = src;
        this.partialPath = partialPath;
        this.tempFolderPath = null;
        this.tempCSSFilePath = null;
    }

    boot(){

        this.tempCSSFilePath = this.getTempPath(this.src);

        console.log('File path ', this.tempCSSFilePath);

        let fileType = Path.extname(this.src).toLowerCase();

        if(fileType === '.scss'){
            mix.sass(this.src, this.tempCSSFilePath);
        }else if(fileType === '.css'){
            mix.sass(this.src, this.tempCSSFilePath);
        }

        mix.then(() => {
            this.updatePartial();
        });

        /**
         * Delete temp directory
         */
        process.on('exit', () => {
            this.deleteFolderRecursive(this.tempFolderPath);
        });
    }

    /**
     * Create temp folder and return temp file path
     * @param filePath
     * @return {string}
     */
    getTempPath(filePath){

        if(Config.publicPath.trim() === ""){
            this.tempFolderPath = fs.mkdtempSync(path.join(Os.tmpdir(), 'laravel-mix-css-partial-'));
        }else{
            this.tempFolderPath = Config.publicPath + '/temp-laravel-mix-css-partial';
        }

        return this.tempFolderPath + '/' + Path.parse(filePath).name + ".css";
    }

    updatePartial(){
        fs.readFile(this.tempCSSFilePath, 'utf8', (err, data) => {
            if (err) {
                console.log('Unable to open file: ' + err);
                return;
            }

            const cssCode = `<style>${data}</style>`;

            fs.writeFile(this.partialPath, cssCode, (err) => {
                if (err){
                    throw err
                };
            });
        });
    }

    /**
     * Delete folder recursively
     * @param path
     */
    deleteFolderRecursive(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach((file, index) => {
                const curPath = Path.join(path, file);
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    this.deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }
}

mix.extend('cssPartial', new cssPartial());