from os import getenv
from cfenv import AppEnv


# try to find redis credentials in PCF
cf_env = AppEnv()
redis_service_data = cf_env.get_service(instance_name='chem-cache')
try:
    cf_redis_credentials = redis_service_data.credentials
except AttributeError:
    cf_redis_credentials = None

cache_configs = {
    'development': {
        'host': getenv('REDIS_HOST'),
        'port': getenv('REDIS_PORT'),
        'db': '0'
    },
    'staging': cf_redis_credentials,
    'production': cf_redis_credentials
}

env = getenv('FLASK_ENV')
cache_credentials = cache_configs[env]
