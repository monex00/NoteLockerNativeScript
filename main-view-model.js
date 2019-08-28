const Observable = require("tns-core-modules/data/observable").Observable;
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const fileSystemModule = require("tns-core-modules/file-system");


function Item(title, id){
    this.title=title;
    this.id=id;
}

function createViewModel(page) {
    const viewModel = new Observable();
    viewModel.items = new ObservableArray();

    var ioOperation= new IOoperation();
   
 

    /* caricamento da index.txt */
    ioOperation.getIndexContent().then((res) =>{
        var lines= res.split('/n');
        for (let i = 0; i < lines.length; i++) {
            var id = lines[i].split(":")[1];
            name= lines[i].split(":")[0];

            if(lines[i] != ""){
                viewModel.items.push(new Item("Nota " + name, id));
            }
        } 
    });       

    viewModel.onAdd = () => {
        ioOperation.add().then(() => {
            ioOperation.getIndexContent().then((res) =>{
                var lines= res.split("/n");
                var last = lines.length -1;
                var id = lines[last -1].split(":")[1];
                viewModel.items.push(new Item("Nota " + last, id));
            });
        });
    }
    

    viewModel.onSelected = (args) =>{
        var listView = args.object;
        var items = listView.getSelectedItems();
        var value = items[0].id;
        var navigationOptions={
            moduleName:'OpeningPage',
            context:{path: value}
        }
        page.frame.navigate(navigationOptions);
    }

    viewModel.clear = () => {
        ioOperation.clear();
        let length=viewModel.items.length
        for (let i = 0; i < length; i++) {
            viewModel.items.pop(i);     
        }
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

    add(){
        return this.getIndexContent().then((res) =>{
            var lines= res.split('/n');
            
            var newRes= res + lines.length + ":" + "nota" + lines.length + ".txt" + "/n";
            console.log(newRes);
            var file = this.folder.getFile("index.txt");
            var note = this.folder.getFile("nota"+ lines.length +".txt");

            return file.writeText(newRes)
            .then((result)=>{
                console.log(" get index done")
            })
        });      
            //TODO: creating the real note file
    }
}


exports.createViewModel = createViewModel;
