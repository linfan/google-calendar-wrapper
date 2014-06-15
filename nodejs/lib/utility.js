
function waitUntilAvailable(varGetter, callback, timeout)
{
    timeout = timeout || 100;
    if ( varGetter() != null ) {
        callback(varGetter());
    } else {
        setTimeout(function() { waitUntilAvailable(varGetter, callback, timeout); } ,timeout);
    }
}

exports.waitUntilAvailable = waitUntilAvailable;