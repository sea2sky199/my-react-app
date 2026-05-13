from flask import request
from flask_restx import Resource

from services import catch_exceptions, check_auth, get_paginated_list
from controllers import compounds_controller as controller
from docs import CompoundsDocs as docs


api = docs.api


@api.route('/')
class CompoundsList(Resource):
    @catch_exceptions
    @check_auth
    @api.doc(body=docs.compounds_list_model)
    def post(self):
        """
        Get cursory data on all compounds from chemdb or return cursory data on
        the top n most similar compounds to the one spcified.

        Returns:
            JSON
        """

        data = request.get_json()

        if 'n_compounds' in data and 'compound_number' in data:
            compounds, row_count, ranges = controller.get_similar_compounds(data)
        else:
            compounds, row_count, ranges = controller.get_compounds_list(data)
        if len(compounds) == 0:
            res = {'results': [], 'ranges': ranges}
            return res
        else:
            start = data['start']
            limit = data['limit']
            res = get_paginated_list(compounds, row_count, start=start, limit=limit)
            res['ranges'] = ranges
            return res


@api.route('/<string:compound_number>')
class Compound(Resource):
    @catch_exceptions
    @check_auth
    @api.doc(body=docs.compound_model)
    def post(self, compound_number):
        """
        Get metadata on a compound from chemdb.

        Arguments:
            compound_number {str} -- a compound number in string format

        Returns:
            JSON
        """

        data = request.get_json()

        res = controller.get_compound_details(compound_number, data)
        if len(res) == 0:
            api.abort()
        return res


@api.route('/summary')
class CompoundSummary(Resource):
    @catch_exceptions
    @check_auth
    @api.doc(body=docs.auth_model)
    def post(self):
        """
        Get metadata on a compound from chemdb for requestAccess page.

        Returns:
            JSON
        """

        data = request.get_json()

        res = controller.get_compounds_summary(data)
        return res


@api.route('/explore')
class CompoundExplore(Resource):
    @catch_exceptions
    @check_auth
    @api.doc(body=docs.auth_model)
    def post(self):
        """
        Get all compound exploration data for d3 filtering in the icicle chart.

        Returns:
            JSON
        """

        data = request.get_json()

        res = controller.get_compounds_explore(data)
        return res


@api.route('/metadata')
class CompoundMetadata(Resource):
    @catch_exceptions
    @check_auth
    @api.doc(body=docs.auth_model)
    def post(self):
        """
        Get all compound metadata for filtering in the table/grid view.

        Returns:
            JSON
        """

        data = request.get_json()

        res = controller.get_compounds_metadata(data)
        return res


@api.route('/distribution')
class CompoundDistribution(Resource):
    @catch_exceptions
    @check_auth
    @api.doc(body=docs.distribution_model)
    def post(self):
        """
        Get distribution data for all compounds for d3 distribution chart.

        Returns:
            JSON
        """

        data = request.get_json()

        compounds_distribution, compound_profile, z_score_metadata, compound_data = controller.get_compounds_distribution(data)
        res = {'distribution': compounds_distribution, 'compound_profile': compound_profile, 'z_score_metadata': z_score_metadata, 'compound_data': compound_data}
        return res


@api.route('/distribution/<string:compound_number>')
class SimilarCompoundDistribution(Resource):
    @catch_exceptions
    @check_auth
    @api.doc(body=docs.distribution_model)
    def post(self, compound_number):
        """
        Get distribution data for a subset of compounds for d3 distribution chart.

        Returns:
            JSON
        """

        data = request.get_json()
        data['compound_number'] = compound_number

        compounds_distribution, compound_profile, z_score_metadata, compound_data = controller.get_similar_compounds_distribution(
            data)
        res = {'distribution': compounds_distribution, 'compound_profile': compound_profile, 'z_score_metadata': z_score_metadata, 'compound_data': compound_data}
        return res
