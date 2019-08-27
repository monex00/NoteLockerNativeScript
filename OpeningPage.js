const Observable = require("tns-core-modules/data/observable").Observable;

function onNavigatingTo(args) {
   
    const page = args.object;

 
    page.bindingContext = createViewModel(page);
}

function createViewModel(page){
    var gotData=page.navigationContext;
    var viewModel= new Observable();
    viewModel.title= gotData.path
    viewModel.text= "heii"

    return viewModel;
}
exports.onNavigatingTo = onNavigatingTo;