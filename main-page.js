
const createViewModel = require("./main-view-model").createViewModel;
var fingerprint = require("nativescript-fingerprint-auth");

var sessions= false;
function onNavigatingTo(args) {
    if(sessions==false){
        auth();
    }
    sessions= true;

    const page = args.object;

 
    page.bindingContext = createViewModel(page);
}

function auth(){
    var fingerprintAuth = new fingerprint.FingerprintAuth();

    fingerprintAuth.verifyFingerprint({
        title: 'verify your identity', 
        message: 'Scan your finger', 
        authenticationValidityDuration: 5, 
        useCustomAndroidUI: false 
    })
    .then( () => {
        
     })
    .catch(error => alert("Biometric ID NOT OK: " + JSON.stringify(error)));
}

exports.onNavigatingTo = onNavigatingTo;
