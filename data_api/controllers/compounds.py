from numpy import log, asarray, nonzero
from services import (db, cache, get_ranges, get_z_score_metadata, format_distribution,
                      set_similarity_col, reorder_df, apply_table_transformations,
                      compounds_df_to_dict, range_df_to_dict, transform_distribution_df,
                      format_compounds_explore_hierarchy, format_compounds_summary)
from config import (short_term_cache, long_term_cache, max_similar_compounds,
                    icicle_columns, distribution_cols)


class CompoundsController(object):
    def get_compounds_metadata(self, transform_dict):
        key = cache.generate_key('compounds-metadata', **transform_dict)
        df = cache.get_set_df(key, db.get_compound_metadata, long_term_cache, **transform_dict)
        compounds_metadata = compounds_df_to_dict(df)
        return compounds_metadata

    def get_compounds_explore(self, transform_dict):
        key = cache.generate_key('compounds-explore', **transform_dict)
        df = cache.get_set_df(key, db.get_compound_explore, long_term_cache, icicle_columns, **transform_dict)
        compounds_explore = format_compounds_explore_hierarchy(df)
        return compounds_explore

    def get_compounds_summary(self, transform_dict):
        key = cache.generate_key('compounds-summary', **transform_dict)
        df = cache.get_set_df(key, db.get_compounds_summary, long_term_cache, **transform_dict)
        compounds_summary = compounds_df_to_dict(df)
        formatted_compounds_summary = format_compounds_summary(compounds_summary)
        return formatted_compounds_summary

    def get_compound_details(self, compound_number, transform_dict):
        key = cache.generate_key('compound-details', compound_number=compound_number, **transform_dict)
        df = cache.get_set_df(key, db.get_compound_details, short_term_cache, compound_number)
        df, _ = apply_table_transformations(df, **transform_dict)
        compound_details = compounds_df_to_dict(df)
        return compound_details

    def get_compounds_list(self, transform_dict):
        df, row_count, ranges, _ = self.get_compounds_df(transform_dict)
        compounds_list = compounds_df_to_dict(df)
        return compounds_list, row_count, ranges

    def get_compounds_df(self, transform_dict):
        key = cache.generate_key('compounds-list')
        df = cache.get_set_df(key, db.get_compounds_list, long_term_cache)

        # create df of ranges for frontend filtering
        key = cache.generate_key('compounds-list-ranges')
        range_df = cache.apply_df_func(key, df, long_term_cache, get_ranges)

        if 'similar_compounds' in transform_dict:
            df.set_index('compoundNumber', inplace=True)
            df = df.loc[transform_dict['similar_compounds']]
            df = df.reset_index()
            range_df = get_ranges(df)

        z_score_metadata = get_z_score_metadata(df)
        ranges = range_df_to_dict(range_df)
        df, row_count = apply_table_transformations(df, **transform_dict)
        return df, row_count, ranges, z_score_metadata

    def get_similar_compounds(self, transform_dict):
        key = cache.generate_key('similar-compounds', **transform_dict)
        df = cache.has(key)
        if df is None:
            compound_number = transform_dict['compound_number']
            compound_ids_str_df = db.get_similar_compounds(compound_number)
            compound_ids_list = list(map(int, compound_ids_str_df.iloc[0].values[0].strip('()').split(',')[1:]))
            df = db.get_similar_compounds_details(compound_ids_list)
            reorder_func = reorder_df(compound_ids_list, set_similarity_col)
            df = cache.apply_df_func(key, df, short_term_cache, reorder_func)
        key = cache.generate_key('similar-compounds-ranges', **transform_dict)
        range_df = cache.apply_df_func(key, df, short_term_cache, get_ranges)
        df, row_count = apply_table_transformations(df, **transform_dict)
        ranges = range_df_to_dict(range_df)
        similar_compounds = compounds_df_to_dict(df)
        return similar_compounds, row_count, ranges

    def get_compounds_distribution(self, transform_dict):
        compound_number = transform_dict['compound_number']
        # cache key needs to ignore compound_number here
        del transform_dict['compound_number']
        is_similar = transform_dict['is_similar'] if 'is_similar' in transform_dict else False
        df, _, ranges, z_score_metadata = self.get_compounds_df(transform_dict)
        df = transform_distribution_df(df, distribution_cols)
        key = cache.generate_key('compounds-distribution')

        distribution_dict = None
        if is_similar:
            distribution_dict = format_distribution(df, ranges)
        else:
            distribution_dict = cache.get_set(key, format_distribution, long_term_cache, df=df, ranges=ranges)

        compound_attributes = df.loc[compound_number]
        compound_profile = self.get_compound_profile(compound_number, compound_attributes, df, distribution_dict)
        return distribution_dict, compound_profile, z_score_metadata, self.get_compound_details(compound_number, transform_dict)[0]

    def get_compound_profile(self, compound_number, compound_attributes, df, distribution_dict):
        compound_profile = {}
        for col in distribution_cols:
            column_profile = {}
            bins = asarray(distribution_dict[col]['bins'])
            value = log(compound_attributes[col])
            indices_less_than_value = nonzero(bins <= value)
            index_val = int(indices_less_than_value[0][-1])
            column_profile['left_bin'] = index_val
            compound_profile[col] = column_profile
            del distribution_dict[col]['bins']
            percentile = df[col].rank(pct=True)
            percentile = float(percentile.loc[compound_number])
            column_profile['percentile'] = percentile
        return compound_profile

    def get_similar_compounds_distribution(self, transform_dict):
        transform_dict['n_compounds'] = max_similar_compounds
        similar_compounds, _, __ = self.get_similar_compounds(transform_dict)
        similar_compounds = [row['compoundNumber'] for row in similar_compounds]
        transform_dict['similar_compounds'] = [transform_dict['compound_number']] + similar_compounds
        return self.get_compounds_distribution(transform_dict)

    def is_compounds_df_outdated(self, transform_dict):
        df, row_count, ranges, _ = self.get_compounds_df(transform_dict)
        new_row_count = db.get_compounds_count()['row_count'].values[0]
        new_cols_df = db.get_compounds_list(one_row=True)
        is_outdated = (row_count != new_row_count) | (set(df.columns) != set(new_cols_df.columns))
        return is_outdated

    def is_compounds_metadata_outdated(self, transform_dict):
        cached_item = self.get_compounds_metadata(transform_dict)
        is_outdated = cache.is_outdated(cached_item, db.get_compound_metadata, [compounds_df_to_dict], **transform_dict)
        return is_outdated

    def is_compounds_summary_outdated(self, transform_dict):
        cached_item = self.get_compounds_summary(transform_dict)
        is_outdated = cache.is_outdated(cached_item, db.get_compounds_summary, [compounds_df_to_dict, format_compounds_summary], **transform_dict)
        return is_outdated

    def is_compounds_explore_outdated(self, transform_dict):
        cached_item = self.get_compounds_explore(transform_dict)
        is_outdated = cache.is_outdated(cached_item, db.get_compound_explore, [format_compounds_explore_hierarchy], icicle_columns, **transform_dict)
        return is_outdated
