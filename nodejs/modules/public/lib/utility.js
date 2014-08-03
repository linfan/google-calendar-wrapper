function Utility() {

    var self = this;

    fs.readFile(path.resolve(__dirname, '..', 'client_secrets.json'), 'utf8', function (err,data) {
        if (err) {
            return util.log(err);
        }
        var client_info = JSON.parse(data)['web'],
            redirect_uri = client_info['redirect_uris'][0];
        this._hostname = redirect_uri.replace(/http[s]?:\/\/([^:\/]+)[:\/].*/, '$1');
        this._port = redirect_uri.replace(/http[s]?:\/\/[^:\/]+:([0-9]+)\/.*/, '$1');
        if (this._port == '')
            this._port = '80';
    });

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

    this.hostname = function () {
        return this._hostname;
    }

    this.port = function () {
        return this._port;
    }

}

var utility = new Utility;
exports.Utility = utility;