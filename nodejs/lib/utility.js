function Utility() {

    function waitUntilAvailable(varGetter, callback, timeout) {
        timeout = timeout || 100;
        if ( varGetter() != null ) {
            callback(varGetter());
        } else {
            setTimeout(function() { waitUntilAvailable(varGetter, callback, timeout); } ,timeout);
        }
    }

    var DEBUG_MODE = true;
    function log(str) {
        if (DEBUG_MODE) {
            console.log(str);
        }
    }

}

var utility = new Utility;
exports.Utility = utility;