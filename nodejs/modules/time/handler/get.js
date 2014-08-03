var dateFormat = require('../../public/lib/dateFormat');

function TimeHandler() {
    this.index = function(req, res) {
        var now = new Date();
        var time_str = now.format("isoDateTime") + "+08:00";
        res.json({
            status: 'OK',
            time: time_str
        });
    }
}

exports.TimeHandler = new TimeHandler;
