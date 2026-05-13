from flask_restx import Namespace


class UtilsDocs:
    api = Namespace(name='utilities', description='Misc utilities', path='/utils')
