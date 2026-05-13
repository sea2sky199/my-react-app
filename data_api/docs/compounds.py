from flask_restx import Namespace, fields


class CompoundsDocs:
    api = Namespace(name='compounds', description='Compounds related operations', path='/compounds')

    auth_model = api.model('Auth', {'role': fields.String(required=True, example='ADMIN')})

    distribution_model = api.inherit('Distribution', auth_model,
                                     {'compound_number': fields.String(required=True, example='1*****0-1')})

    compound_model = api.inherit('Compound', auth_model,
                             {'finance_permission': fields.Boolean(required=False, example=True)})

    compounds_list_model = api.inherit('Compounds List', compound_model,
                                   {
                                       'start': fields.Integer(required=True, example=1),
                                       'limit': fields.Integer(required=True, example=25),
                                       'filters': fields.Raw(required=False, example={'compoundElement': ['ALUMINUM']}),
                                       'range_filters': fields.Raw(required=False, example={'finishedLengthInches': [0.05, 5.18]}),
                                       'search': fields.Raw(required=False, example={})
                                   })
