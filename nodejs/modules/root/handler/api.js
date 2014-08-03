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
        var url = '/' + type + '/get?user=' + uid;
        res.redirect(url);
    }

    this.login = function (req, res) {
        uid = req.param('user');
        type = req.param('type');
        var url = '/' + type + '/login?user=' + uid;
        res.redirect(url);
    }

    this.events_list = function (req, res) {
        uid = req.param('user');
        type = req.param('type');
        var url = '/' + type + '/event_list?user=' + uid;
        res.redirect(url);
    }

}

exports.RootHandler = new RootHandler;
