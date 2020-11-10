const Task = require('laravel-mix/src/tasks/Task');
const fs = require('fs');
const Path = require('path');

class CssPartialTask extends Task {

    constructor(data) {
        super(data);

        this.src = data.src;
        this.partialPath = data.partialPath;
        this.tempFolderPath = null;
        this.tempCSSFilePath = null;
        this.mix = data.mix;

        this.init();
    }

    run() {
        this.updatePartial();
    }

    init(){

        this.tempCSSFilePath = this.getTempPath(this.src);
        const {pluginOptions, postCssPlugins} = this.data;
        this.files = {get(){ return this.src; }};

        let fileType = Path.extname(this.src).toLowerCase();

        if(fileType === '.scss' || fileType === '.sass'){
            this.mix.sass(this.src, this.tempCSSFilePath, pluginOptions, postCssPlugins);
        }else if(fileType === '.css'){
            this.mix.postCss(this.src, this.tempCSSFilePath, postCssPlugins);
        }else if(fileType === '.less'){
            this.mix.less(this.src, this.tempCSSFilePath, pluginOptions, postCssPlugins);
        }else if(fileType === '.styl'){
            this.mix.stylus(this.src, this.tempCSSFilePath, pluginOptions, postCssPlugins);
        }

        /**
         * Delete temp directory
         */
        process.on('SIGINT', () => {
            this.cleanUp();
            process.exit();
        });
        process.on('exit', () => {
            this.cleanUp();
        });
    }

    /**
     * Create temp folder and return temp file path
     * @param filePath
     * @return {string}
     */
    getTempPath(filePath){

        let tempDirParent = 'node_modules';
        if(Config.publicPath.trim() !== ""){
            tempDirParent = Config.publicPath;
        }
        this.tempFolderPath = fs.mkdtempSync(tempDirParent + '/temp-css-partial-');

        return this.tempFolderPath + '/' + Path.parse(filePath).name + ".css";
    }

    updatePartial(sourceFile = this.tempCSSFilePath){
        fs.readFile(sourceFile, 'utf8', (err, data) => {
            if (err) {
                console.log('Unable to open file: ' + err);
                return;
            }

            const cssCode = `<style>${data}</style>`;

            fs.writeFile(this.partialPath, cssCode, (err) => {
                if (err){
                    throw err
                }

                console.log('\x1b[32m%s\x1b[0m', `CSS Partial '${this.partialPath}' Updated`);
            });
        });
    }

    cleanUp(){
        this.deleteFolderRecursive(this.tempFolderPath);
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

    onChange(){}

}
module.exports = CssPartialTask;
