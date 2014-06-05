from bottle import route, request, response

@route('/')
def main_handler():
    return '{<br>status: OK<br>detail: nothing to show on this URL<br>}'
