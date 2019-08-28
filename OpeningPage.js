const Observable = require("tns-core-modules/data/observable").Observable;
const fileSystemModule = require("tns-core-modules/file-system");
var CryptoJS = require("crypto-js");


function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = createViewModel(page);
}

function createViewModel(page){
    var gotData=page.navigationContext;
    var viewModel= new Observable();
    viewModel.title= gotData.path
    viewModel.text= "";

    var ioOperation= new IOoperation();
    ioOperation.getFileContent(gotData.path).then((res) => {
        var bytes  = CryptoJS.AES.decrypt(res, 'Aj3DkSkS3N');
        var plaintext = bytes.toString(CryptoJS.enc.Utf8);
        viewModel.set("text",plaintext);
    })

    viewModel.onSave = () => {
        var cryText = CryptoJS.AES.encrypt(viewModel.text.toString(), 'Aj3DkSkS3N');
        ioOperation.setFileContent(gotData.path, cryText.toString()).then(() => {
            page.frame.goBack();
        });
        
    }

    return viewModel;
}

class IOoperation{
    constructor(){
        this.indexPath="";
        
        var documents = fileSystemModule.knownFolders.documents();
        var folder = documents.getFolder("data");
        
        this.documents= documents;
        this.folder= folder;
    }

    getIndex(){
        var file = this.folder.getFile("index.txt");
        this.indexPath=file.path;
        return this.indexPath;
    }

    getIndexContent(){
        var file = this.folder.getFile("index.txt");
        return file.readText();
    }

    clear(){
        this.folder.remove()
        .then((fres) => {
            // Success removing the folder.
            console.log("removed");
        }).catch((err) => {
            console.log(err.stack);
        });
    }

    getFileContent(name){
        var file = this.folder.getFile(name);
        return file.readText();
    }

    setFileContent(name, text){
        const file = this.folder.getFile(name);

        return file.writeText(text);
    }

    add(){
        return this.getIndexContent().then((res) =>{
            var lines= res.split('/n');
            
            var newRes= res + lines.length + ":" + "nota" + lines.length + ".txt" + "/n";
            console.log(newRes);
            var file = this.folder.getFile("index.txt");

            return file.writeText(newRes)
            .then((result)=>{
                console.log(" get index done")
            })
        });      
            //TODO: creating the real note file
    }
}

exports.onNavigatingTo = onNavigatingTo;