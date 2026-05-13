import json
from numpy import histogram, log
from config import distribution_cols, icicle_columns


def get_ranges(df):
    return df.describe().loc[['min', 'max']]

def get_z_score_metadata(df):
    z_score_metadata = {}
    mean_series = df.mean(skipna=True, numeric_only=True)
    std_series = df.std(skipna=True, numeric_only=True)
    for index, value in mean_series.items():
        z_score_metadata[index] = { 'mean': value, 'std': std_series[index]}

    return z_score_metadata
 
def format_distribution(df, ranges):
    distribution_dict = {}
    for col in distribution_cols:
        frequency, bins = histogram(log(df[col].values), bins=100)
        frequency = list(map(int, frequency))
        bins = list(map(float, bins))
        quartiles = list(log(df[col]).quantile([.25, .5, .75, 1]).values)
        log_range = list(map(float, log(ranges[col])))
        distribution_dict[col] = {'frequency': frequency,
                                  'bins': bins,
                                  'log_range': log_range,
                                  'quartiles': quartiles}
    return distribution_dict


def format_compounds_explore_hierarchy(df):
    compounds_explore = {'name': 'ALL PARTS', 'children': []}
    for _, row in df.iterrows():
        current_parent = compounds_explore
        for col_index, col in enumerate(icicle_columns):
            filter_value = row[col]
            child_index = None
            if len(current_parent['children']) > 0:
                for i, d in enumerate(current_parent['children']):
                    if d['name'] == filter_value:
                        child_index = i
                        break
                    else:
                        child_index = -1
            else:
                child_index = -1
            if child_index < 0:
                new_child = {'name': filter_value, 'children': [], 'grouping': col}
                if col_index == len(icicle_columns) - 1:
                    new_child['total'] = row['total']
                current_parent['children'].append(new_child)
                child_index = len(current_parent['children']) - 1
            current_parent = current_parent['children'][child_index]
    return compounds_explore


def format_compounds_summary(summary_dict):
    return {stat['groupKey'].lower(): {'group': stat['grouping'], 'count': stat['val']} for stat in summary_dict}


def compounds_df_to_dict(df):
    compounds_data = df.to_json(orient='records')
    compounds_data = json.loads(compounds_data)
    return compounds_data


def range_df_to_dict(range_df):
    ranges = range_df.to_json(orient='columns')
    ranges = json.loads(ranges)
    ranges = {column: [value['min'], value['max']] for column, value in ranges.items()}
    return ranges
