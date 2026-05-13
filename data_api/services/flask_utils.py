import functools
from flask import make_response, request, abort, jsonify
from os import getenv
from sys import stderr
from traceback import format_exc


MAX32BIT = int('1' * 31, 2)


def check_auth(func):
    """
    Before each wrapped function: if there is an environment configuration
    setting for authentication, make sure all requests include it

    Decorators:
        functools.wraps

    Arguments:
        func -- wrapped function

    Returns:
        func -- returns the function
    """

    @functools.wraps(func)
    def wrapper_login_required(*args, **kwargs):
        auth_token = getenv('CHEM_AUTH_TOKEN')
        if auth_token is not None:
            # Check the request
            if request.authorization is None:
                print("Unauthorized request", file=stderr)
                return make_response(str("Unauthorized, access token not provided"), 403)
            elif auth_token != request.authorization['password']:
                print("Unauthorized request, invalid credentials", file=stderr)
                return make_response(str("Unauthorized, invalid access token"), 403)
            else:
                return func(*args, **kwargs)
        else:
            return func(*args, **kwargs)
    return wrapper_login_required


def catch_exceptions(func):
    """
    Catches exceptions that may occur inside a wrapped function and prints the
    traceback to stderr.

    Decorators:
        functools.wraps

    Arguments:
        func -- wrapped function

    Returns:
        requests.response -- 400 response with the contents of the raised exception
    """

    @functools.wraps(func)
    def wrapper_catch_all(*args, **kwargs):
        try:
            response = func(*args, **kwargs)
            return response
        except Exception:
            print(str(format_exc()), file=stderr)

            # This is the error when any internal
            response = {
                'message': 'Invalid Data API call!',
                'statusCode': 400
            }
                                                # error happens, could handle with better messages
            return make_response(jsonify(response), 400)
    return wrapper_catch_all


def get_paginated_list(results, row_count, start, limit):
    """
    Paginates a dictionary, returning only the results at the requested index.

    Arguments:
        results {dict} -- the data requested from a route
        row_count {int} -- number of results returned
        start {int} -- row index to start at
        limit {int} -- how many results to return in a single page

    Returns:
        dict -- paginated dictionary with some additional metadata
            example: {
                'start': 1,
                'limit': 25,
                'count': 25,
                'results': {...}
            }
    """

    global MAX32BIT

    start = int(start)
    limit = int(limit)
    count = row_count
    if count < start or limit < 0 or start > MAX32BIT or limit > MAX32BIT:
        abort(404)
    # make response
    obj = {}
    obj['start'] = start
    obj['limit'] = limit
    obj['count'] = count
    # make URLs
    # make previous url
    if start == 1:
        obj['previous'] = ''
    else:
        start_copy = max(1, start - limit)
        limit_copy = start - 1
        obj['previous'] = 'start=%d&limit=%d' % (start_copy, limit_copy)
    # make next url
    if start + limit > count:
        obj['next'] = ''
    else:
        start_copy = start + limit
        obj['next'] = 'start=%d&limit=%d' % (start_copy, limit)
    # finally extract result according to bounds
    obj['results'] = results
    return obj
