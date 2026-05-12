import { getLinearScale, getScalePoint } from './d3-scales'

export const compoundsColumns = new Map([
    [
        'compoundNumber',
        {
            title: 'Compound Number',
            visible: true,
            editable: false,
            financeAccessor: false
        }
    ],
    [
        'compoundNumberClean',
        {
            title: 'Compound Number Clean',
            visible: false,
            editable: false,
            financeAccessor: false
        }
    ],
    [
        'compoundNumberVersion',
        {
            title: 'Compound Number Version',
            visible: false,
            editable: false,
            financeAccessor: false
        }
    ],
    [
        'compoundName',
        {
            title: 'Compound Name',
            visible: true,
            editable: false,
            financeAccessor: false
        }
    ],
    [
        'compoundElement',
        {
            title: 'Compound Material',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'compoundForm',
        {
            title: 'Compound Form',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'program',
        {
            title: 'Program',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'finishedLengthInches',
        {
            title: 'Finished Length',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'finishedWidthInches',
        {
            title: 'Finished Width',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'finishedHeightInches',
        {
            title: 'Finished Height',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'finishedSurfaceAreaInches2',
        {
            title: 'Finished Surface Area',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'finishedVolumeInches3',
        {
            title: 'Finished Volume',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'finishedWeightPounds',
        {
            title: 'Finished Weight',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'buyToFly',
        {
            title: 'Buy To Fly',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'stockWeightPounds',
        {
            title: 'Stock Weight',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'stockLengthInches',
        {
            title: 'Stock Length',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'stockWidthInches',
        {
            title: 'Stock Width',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'stockHeightInches',
        {
            title: 'Stock Height',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'stockSurfaceAreaInches2',
        {
            title: 'Stock Surface Area',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'stockVolumeInches3',
        {
            title: 'Stock Volume',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'onContract',
        {
            title: 'On Contract',
            visible: true,
            editable: true,
            financeAccessor: true
        }
    ],
    [
        'supplierName',
        {
            title: 'Supplier Name',
            visible: true,
            editable: true,
            financeAccessor: true
        }
    ],
    [
        'demandVolume',
        {
            title: 'Demand Volume',
            visible: true,
            editable: true,
            financeAccessor: true
        }
    ],
    [
        'unitPrice',
        {
            title: 'Unit Price',
            visible: true,
            editable: true,
            financeAccessor: true
        }
    ],
    [
        'contractPrice',
        {
            title: 'Contract Price',
            visible: true,
            editable: true,
            financeAccessor: true
        }
    ],
    [
        'predictedPrice',
        {
            title: 'Predicted Price',
            visible: true,
            editable: true,
            financeAccessor: true
        }
    ],
    [
        '5YearPredictedOpportunity',
        {
            title: '5 Year Predicted Opportunity',
            visible: true,
            editable: true,
            financeAccessor: true
        }
    ],
    [
        'complexityCode',
        {
            title: 'Complexity Code',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ],
    [
        'sizeCode',
        {
            title: 'Size Code',
            visible: true,
            editable: true,
            financeAccessor: false
        }
    ]
])

export const similarityColumns = new Map([
    [
        'similarityRank',
        {
            title: 'Similarity Rank',
            visible: true,
            editable: false,
            financeAccessor: false
        }
    ],
    ...compoundsColumns.entries()
])

export const compareCompoundsHeaderOrder = [
    'compoundNumber',
    'compoundName',
    'compoundElement',
    'compoundForm',
    'program',
    'onContract',
    'supplierName',
    'demandVolume',
    'unitPrice',
    'contractPrice',
    'predictedPrice',
    '5YearPredictedOpportunity',
    'finishedLengthInches',
    'finishedWidthInches',
    'finishedHeightInches',
    'finishedSurfaceAreaInches2',
    'finishedVolumeInches3',
    'finishedWeightPounds',
    'stockLengthInches',
    'stockWidthInches',
    'stockHeightInches',
    'stockSurfaceAreaInches2',
    'stockVolumeInches3',
    'stockWeightPounds',
    'totalHoleCount',
    'simpleHoleCount',
    'buyToFly'
]

export const sizeSubCodeOrder = ['xs', 's', 'm', 'lg', 'xlg']

export const sizeCodeOrder = [
    ...['A', 'B', 'C', 'D', 'E'].reduce((acc, sizeCode) => {
        sizeSubCodeOrder.forEach(sizeSubCode =>
            acc.push(`${sizeCode}-${sizeSubCode}`)
        )
        return acc
    }, []),
    'UNCLASSIFIED'
]

export const sizeCodeRanges = [
    ['0', '1.4'],
    ['1.4', '2.8'],
    ['2.8', '4.3'],
    ['4.3', '5.7'],
    ['5.7', '7.2'],
    ['7.2', '9.5'],
    ['9.5', '11.9'],
    ['11.9', '14.4'],
    ['14.4', '17.1'],
    ['17.1', '20'],
    ['20', '30.6'],
    ['30.6', '43.4'],
    ['43.4', '58.2'],
    ['58.2', '75'],
    ['75', '93.9'],
    ['93.9', '519'],
    ['519', '1.23e3'],
    ['1.23e3', '2.22e3'],
    ['2.22e3', '3.46e3'],
    ['3.46e3', '5e3'],
    ['5e3', '6.84e3'],
    ['6.84e3', '9.78e3'],
    ['9.78e3', '1.54e4'],
    ['1.54e4', '2.83e4'],
    ['2.83e4', 'Infinity']
]

export const complexityCodeOrder = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'UNCLASSIFIED'
]

const defaultGetLinearScale = {
    getScale: getLinearScale
}

export const opportunityChartAccessorConfig = {
    sizeCode: {
        getScale: getScalePoint,
        order: sizeCodeOrder
    },
    complexityCode: {
        getScale: getScalePoint,
        order: complexityCodeOrder
    },
    contractPrice: defaultGetLinearScale,
    predictedPrice: defaultGetLinearScale,
    priceDelta: defaultGetLinearScale,
    '5YearOpportunitySpend': defaultGetLinearScale,
    '5YearForecastQuantity': defaultGetLinearScale,
    '5YearForecastSpend': defaultGetLinearScale,
    '5YearPredictedSpend': defaultGetLinearScale
}

export const zScoreAccessors = [
    'stockLengthInches',
    'stockWidthInches',
    'stockHeightInches',
    'stockSurfaceAreaInches2',
    'stockVolumeInches3',
    'finishedLengthInches',
    'finishedWidthInches',
    'finishedHeightInches',
    'finishedSurfaceAreaInches2',
    'finishedVolumeInches3',
    'finishedWeightPounds',
    'buyToFly'
]
