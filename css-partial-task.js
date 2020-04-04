const Task = require('/Users/abhishek.sat/Sites/auto/wp-content/themes/autos/node_modules/laravel-mix/src/tasks/Task');
const fs = require('fs');
const Os = require('os');
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
        console.log('task started....', Config.publicPath);
        this.updatePartial();
    }

    init(){

        this.tempCSSFilePath = this.getTempPath(this.src);

        console.log('File path ', this.tempCSSFilePath);

        let fileType = Path.extname(this.src).toLowerCase();

        if(fileType === '.scss' || fileType === '.sass'){
            this.mix.sass(this.src, this.tempCSSFilePath);
        }else if(fileType === '.css'){
            this.mix.styles(this.src, this.tempCSSFilePath);
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

        if(Config.publicPath.trim() === ""){
            this.tempFolderPath = fs.mkdtempSync(path.join(Os.tmpdir(), 'laravel-mix-css-partial-'));
        }else{
            this.tempFolderPath = fs.mkdtempSync(Config.publicPath + '/temp-laravel-mix-css-partial');
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
                }
            });
        });
    }

    cleanUp(){
        console.log('file deleted');
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
}
module.exports = CssPartialTask;
