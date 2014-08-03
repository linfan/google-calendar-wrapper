var util = require('../../public/lib/utility').Utility;

function RootHandler() {

    this.index = function(req, res) {
        res.json({
            status: 'OK',
            detail: 'Nothing to show on this page'
        });
    };

}

exports.RootHandler = new RootHandler;
