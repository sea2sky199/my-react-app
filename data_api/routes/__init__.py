from flask_restx import Api
from routes.compounds import api as compounds_api
from routes.utils import api as utils_api


# all route blueprints should be added to this list to be added to app
api = Api(
    title='CHEM Compounds API',
    version='1.0',
    description='API to interact with compounds data stored in Teradata',
)

api.add_namespace(compounds_api)
api.add_namespace(utils_api)
