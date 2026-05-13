from flask_restx import Resource

from services import cache, mattermost, catch_exceptions, check_auth
from controllers import compounds_controller as controller
from config import roles
from docs import UtilsDocs as docs


api = docs.api


@api.route('/clearCache')
class ClearCache(Resource):
    @catch_exceptions
    @check_auth
    def get(self):
        """
        Wipes out Redis cache.
        """

        cache.wipe()
        mattermost.post_message(text='cache cleared')
        return 'OK'


@api.route('/refreshCache')
class SwapCache(Resource):
    @catch_exceptions
    @check_auth
    def get(self):
        """
        Checks if any cached items need refreshing and refreshes them if needed.
        """

        non_guest_roles = roles[:-1]
        transform_dict = {'role': 'ADMIN'}

        rebuilt_items = []

        if not cache.keys('compounds-list*') or controller.is_compounds_df_outdated(transform_dict):
            cache.delete('compounds-list*', soft_match=True)
            controller.get_compounds_df(transform_dict)
            rebuilt_items.append('| compounds-list |')

        if not cache.keys('compounds-explore*') or controller.is_compounds_explore_outdated(transform_dict):
            cache.delete('compounds-explore*', soft_match=True)
            for role in non_guest_roles:
                controller.get_compounds_explore({'role': role})
                rebuilt_items.append(f'| compounds-explore-{role} |')

        if not cache.keys('compounds-summary*') or controller.is_compounds_summary_outdated(transform_dict):
            cache.delete('compounds-summary*', soft_match=True)
            for role in roles:
                controller.get_compounds_summary({'role': role})
                rebuilt_items.append(f'| compounds-summary-{role} |')

        transform_dict['finance_permission'] = 1

        if not cache.keys('compounds-metadata*') or controller.is_compounds_metadata_outdated(transform_dict):
            cache.delete('compounds-metadata*', soft_match=True)
            for role in non_guest_roles:
                for finance_permission in [0, 1]:
                    controller.get_compounds_metadata({'role': role, 'finance_permission': finance_permission})
                    rebuilt_items.append(f'| compounds-metadata-{role}-{finance_permission} |')

        header = ['#### Rebuilt these cached items:', '| Item |', '|:-|']
        rebuilt_items = header + rebuilt_items if rebuilt_items else None
        if rebuilt_items:
            rebuilt_items_str = '\n'.join(rebuilt_items)
            mattermost.post_message(text=f'{rebuilt_items_str}')

        return 'OK'
