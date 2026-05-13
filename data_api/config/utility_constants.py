# number of hours to cache an object for:
# None value will set the value until cache is wiped
# short-term caching is for compound-details and similar-compounds
# long-term caching is for compounds-list, summary-stats, compounds-metadata
short_term_cache = 24
long_term_cache = None

# the maximum number of compounds to be returned in the similar compounds distribution
max_similar_compounds = 1000

roles = ['ADMIN', 'PD USER', 'NMA USER', 'USER', 'GUEST']

# the columns to explore in the icicle chart and the order they should appear in
icicle_columns = ['compoundElement', 'compoundForm', 'sizeCode', 'sizeSubCode']

# columns to display in distribution modal
distribution_cols = ['stockLengthInches', 'stockWidthInches',
                     'stockSurfaceAreaInches2', 'finishedLengthInches',
                     'finishedWidthInches', 'finishedHeightInches',
                     'finishedSurfaceAreaInches2', 'finishedVolumeInches3']

finance_cols = ['onContract', 'supplierName', 'demandVolume',
                'unitPrice', 'contractPrice', 'predictedPrice',
                '5YearPredictedOpportunity', 'priceDelta', 
                '5YearOpportunitySpend', '5YearForecastQuantity', 
                '5YearForecastSpend', '5YearPredictedSpend']

custom_sorts = {
    'sizeCode': [
        'A-xs',
        'A-s',
        'A-m',
        'A-lg',
        'A-xlg',
        'B-xs',
        'B-s',
        'B-m',
        'B-lg',
        'B-xlg',
        'C-xs',
        'C-s',
        'C-m',
        'C-lg',
        'C-xlg',
        'D-xs',
        'D-s',
        'D-m',
        'D-lg',
        'D-xlg',
        'E-xs',
        'E-s',
        'E-m',
        'E-lg',
        'E-xlg',
        'UNCLASSIFIED'
    ]
}
