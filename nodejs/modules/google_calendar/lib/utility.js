function Utility() {

    this.waitUntilAvailable = function (varGetter, callback, timeout) {
        timeout = timeout || 100;
        if ( varGetter() != null ) {
            callback(varGetter());
        } else {
            setTimeout(function() { waitUntilAvailable(varGetter, callback, timeout); } ,timeout);
        }
    };

    var DEBUG_MODE = true;
    this.log = function (info) {
        if (DEBUG_MODE) {
            console.log(info);
        }
    };

}

var utility = new Utility;
exports.Utility = utility;