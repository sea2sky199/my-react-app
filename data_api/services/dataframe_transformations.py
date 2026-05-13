from pandas import Categorical

from config import finance_cols, custom_sorts


def apply_custom_sort(df, column_name):
    if column_name in df:
        df[column_name] = Categorical(values=df[column_name],
                                      categories=custom_sorts[column_name])

    return df


def reorder_df(ordered_list, func=None):
    def apply_reorder_df(df):
        df.set_index('compound_id', inplace=True)
        df = df.loc[ordered_list]
        df = df[df['compoundNumber'].notnull()]
        if func:
            df = func(df)
        else:
            df = df.reset_index()
        return df
    return apply_reorder_df


def transform_distribution_df(df, distribution_cols):
    df.set_index('compoundNumber', inplace=True)
    df = df[distribution_cols]
    df = df.dropna()
    return df


def set_similarity_col(df):
    df['similarityRank'] = df.reset_index().index + 1
    df = df.reset_index()
    df.drop(columns='compound_id')
    return df


def apply_table_transformations(df, **transform_dict):
    """
    transform_dict kwargs: n_compounds, search, string_filters, numeric_filters, sort, role, finance_permission
    """
    if 'n_compounds' in transform_dict:
        # always want to default to 25
        n_compounds = transform_dict['n_compounds'] or 25
        df = df[:n_compounds]
    if 'search' in transform_dict:
        df = compound_search(df, transform_dict['search'])
    if 'filters' in transform_dict:
        df = filter_by_string(df, transform_dict['filters'])
    if 'range_filters' in transform_dict:
        df = filter_by_number(df, transform_dict['range_filters'])
    if 'selected' in transform_dict:
        df = compound_selected(df, transform_dict['selected'])
    if 'similarityRank' in df.columns:
        df = apply_dynamic_ranking(df)
    if 'sort' in transform_dict:
        df = apply_custom_sort(df, 'sizeCode')
        df = sort(df, transform_dict['sort'])
    if 'role' in transform_dict:
        df = check_role(df, transform_dict['role'])
    if 'finance_permission' in transform_dict and not transform_dict['finance_permission']:
        df = strip_finance_columns(df)
    row_count = len(df)
    if 'start' in transform_dict:
        df = index_dataframe(
            df, start=transform_dict['start'], limit=transform_dict['limit'])
    return df, row_count


def compound_search(df, search):
    for search_key, search_value in search.items():
        if search_key == 'all':
            df = df[(df['compoundNumberClean'].str.contains(search_value, regex=False)) | (
                df['compoundName'].str.contains(search_value, regex=False))]
        elif search_key == 'compoundNumber':
            compound_numbers = set(search_value.split())
            if len(compound_numbers) > 1:
                df = df[df['compoundNumberClean'].isin(compound_numbers)]
            else:
                compound_numbers = search_value.split()
                df = df[df['compoundNumberClean'].str.startswith(compound_numbers[0])]
        else:
            df = df[df[search_key].str.contains(search_value, regex=False, na=False)]
    return df


def compound_selected(df, selected):
    df = df[df['compoundNumber'].isin(selected)]
    return df


def filter_by_string(df, string_filters):
    for filter_key, filter_values in string_filters.items():
        df = df[df[filter_key].isin(filter_values)]
    return df


def filter_by_number(df, numeric_filters):
    # users shouldn't be able to filter on similarityRank
    numeric_filters.pop('similarityRank', None)
    for filter_key, filter_values in numeric_filters.items():
        min_val = filter_values[0]
        max_val = filter_values[1]
        df = df[df[filter_key].between(min_val, max_val)]
    return df


def apply_dynamic_ranking(df):
    df.drop(columns='similarityRank')
    df['similarityRank'] = df.reset_index().index + 1
    df = df.reset_index()
    return df


def sort(df, sort):
    ascending_list = [sort_value == 'ascending' for sort_value in sort.values()]
    key_list = [sort_key for sort_key in sort.keys()]
    df = df.sort_values(by=key_list, ascending=ascending_list)
    return df


def check_role(df, role):
    if role in ['ADMIN', 'PD USER']:
        pass
    elif role in ['NMA USER']:
        df = df[(df['unreleasedStatus'] == 0) | (df['program'] == 'NMA')]
    else:
        df = df[df['unreleasedStatus'] == 0]
    return df


def strip_finance_columns(df):
    df = df.drop(finance_cols, axis=1)
    return df


def index_dataframe(df, start, limit):
    df = df[start - 1:start + limit - 1]
    return df
