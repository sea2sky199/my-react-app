import pickle
import redis
import json


class Cache(object):
    """
    Class handler for instantiating and interacting with redis service.

    Arguments:
        redis_service {cfenv.AppEnv} -- environemnt variables loaded using cfenv
    """

    def __init__(self, credentials):
        self.conn = redis.Redis(**credentials)

    def get_set(self, name, format_call, hours, *args, **kwargs):
        value = self.get(name)

        if value is None:
            value = format_call(*args, **kwargs)
            str_value = json.dumps(value)
            self.set(name, str_value, hours)
        else:
            value = json.loads(value)

        return value

    def get_set_df(self, name, db_call, hours, *args, **kwargs):
        value = self.get(name)

        if value is None:
            df = db_call(*args, **kwargs)
            self.set(name, pickle.dumps(df), hours)
        else:
            df = pickle.loads(value)

        return df

    def is_outdated(self, cached_item, db_call, format_calls, *args, **kwargs):
        new_item = db_call(*args, **kwargs)
        for format_call in format_calls:
            new_item = format_call(new_item)
        is_outdated = cached_item != new_item
        return is_outdated

    def apply_func(self, name, hours, func, *args, **kwargs):
        value = self.get(name)

        if value is None:
            value = func(value, *args, **kwargs)
            value = json.dumps(value)
            self.set(name, value, hours)
        else:
            value = json.loads(value)

        return value

    def apply_df_func(self, name, df, hours, df_func):
        value = self.get(name)

        if value is None:
            df = df_func(df)
            self.set(name, pickle.dumps(df), hours)
        else:
            df = pickle.loads(value)

        return df

    def has(self, name):
        value = self.get(name)
        if value is not None:
            return pickle.loads(value)
        else:
            return None

    def keys(self, key):
        keys = self.conn.keys(key)
        return keys

    def get(self, name):
        value = self.conn.get(name=name)
        return value

    def set(self, name, value, hours, **kwargs):
        time = 60 * 60 * hours if hours else None
        self.conn.set(name=name, value=value, ex=time)
        return True

    def delete(self, key, soft_match=False):
        if soft_match:
            keys = self.keys(key)
            for key in keys:
                self.conn.delete(key)
        else:
            self.conn.delete(key)
        return True

    def wipe(self):
        keys = self.conn.keys()
        for key in keys:
            self.delete(key)
        return True

    def generate_key(self, prefix, role=None, compound_number=None, finance_permission=None, **kwargs):
        role_str = None
        if role in ['ADMIN', 'PD USER']:
            role_str = 'FullAccess'
        else:
            role_str = role

        finance_permission = 'finance' if finance_permission else None
        identifiers = [prefix, compound_number, role_str, finance_permission]
        identity = [identifier for identifier in identifiers if identifier]
        return '-'.join(identity)
