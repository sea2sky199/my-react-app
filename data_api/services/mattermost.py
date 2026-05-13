import functools
from sys import stderr
from requests import post


def check_env(func):
    @functools.wraps(func)
    def exec_func(*args, **kwargs):
        mattermost_class = args[0]
        if mattermost_class.webhook_url is not None:
            return func(*args, **kwargs)
        else:
            return print(kwargs['text'], file=stderr)
    return exec_func


class Mattermost(object):
    def __init__(self, webhook_url):
        self.webhook_url = webhook_url

    @check_env
    def post_message(self, text):
        json = {'text': text}
        post(self.webhook_url, json=json, verify=False)
