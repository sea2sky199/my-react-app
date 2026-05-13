from os import getenv


db_configs = {
    'development': {
        'user': getenv('CHEMDB_UN'),
        'password': getenv('CHEMDB_PW'),
        'host': getenv('CHEMDB_HOST'),
        'port': getenv('CHEMDB_PORT'),
        'database': 'ELABS_BCA_CHEM2'
    },
    'staging': {
        'user': getenv('CHEMDB_UN'),
        'password': getenv('CHEMDB_PW'),
        'host': getenv('CHEMDB_HOST'),
        'encryptdata': 'true',
        'sConnectParams': None
    },
    'production': {
        'user': getenv('CHEMDB_UN'),
        'password': getenv('CHEMDB_PW'),
        'host': getenv('CHEMDB_HOST'),
        'encryptdata': 'true',
        'sConnectParams': None
    },
}

env = getenv('FLASK_ENV')
db_credentials = db_configs[env]

# import different driver depending on env
if getenv('FLASK_ENV') in ['production', 'staging']:
    from chemdbsql import connect, Error, DatabaseError
    from services.db_utils import to_qmark as sql_format
else:
    from mysql.connector import connect, Error, DatabaseError
    from services.db_utils import to_pyformat as sql_format
