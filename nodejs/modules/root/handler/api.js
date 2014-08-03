var util = require('../../public/lib/utility').Utility;

function RootHandler() {

    this.index = function(req, res) {
        res.json({
            status: 'OK',
            detail: 'Nothing to show on this page'
        });
    };

    this.get = function (req, res) {
        var uid = req.param('user');
        var type = req.param('type');
        var url = util.hostname() + ':' + util.port() + '/' + type + '/get?user=' + uid;
        util.log('>> API Rediect to: ' + url);
//        res.redirect(url);
    }

    this.login = function (req, res) {
        uid = req.param('user');
        type = req.param('type');
    }

    this.event_list = function (req, res) {
        uid = req.param('user');
        type = req.param('type');
    }

}

exports.RootHandler = new RootHandler;
