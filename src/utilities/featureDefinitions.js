import { siteName } from './utilityConstants'
import { quantityOfResultsDescription } from './descriptions'

export const unrestrictedFeatureDefinitions = {
    similarityRank: `The rank of “similar results” compounds
                compared original queried compound based on the ${siteName} shape
                algorithm`,
    compoundNumber: `the chemdw compound number for the part
                (without revision level)`,
    compoundName: `The name of the compound as classified by
engineering (i.e. Clip, Bracket, etc.)`,
    compoundElement: `A category of compound material type (i.e.
Aluminum, Titanium, etc.)`,
    compoundForm: `A category that describes the part’s
fabrication method (i.e. Sheet, extrusion or plate)`,
    program: `Refers to the airplane organization within the
enterprise (i.e. 737, 747, etc.)`,
    finishedLengthInches: `Final maximum "X" dimension of the
finished product in inches`,
    finishedWidthInches: `Final maximum "Z" dimension of
the finished product in inches`,
    finishedHeightInches: `Final maximum "Y" dimension of
the finished product in inches`,
    finishedVolumeInches3: `total volume of the final sized geometric extraction in cubic
inches`,
    stockWeightPounds: `gives the total weight of the
cuboid that bounds the finished compound (Derived from material)`,
    finishedSurfaceAreaInches2: `Total surface area of the final sized geometric extraction in
square inches`,
    buyToFly: `the ratio of the final volume to the initial
volume of the part`,
    'Quantity of Results (Similar Compounds View)': quantityOfResultsDescription(),
    sizeCode: `Based on a caculated cuboidal volume derived 
from finished height, width and length. This ranking is split 
into roughly five equal segments and assigned a letter code 
A through E. With the 'A' group being the smallest compounds and 
the 'E' group being the largest. Furthermore each letter group
is similarly split into five segments using extra small (XS),
small (S), medium (M), large (Lg) and extra-large (XLg).`,
    complexityCode: `Derived from a logistic regression model 
representing the probability that a compound has high manufacturing 
complexity, ranging from 1 (low manufacturing complexity) – 
10 (high manufacturing complexity). Only available for 
stock-machined compounds at this time.`,
    'Z-Score (Unique Features Visualization)': `Z Score is a
measurement of how unique a particular compound attribute is versus
a specified group of compounds (ex. versus entire compound library, or
similar compound library). The higher the value, the more unique the
part attribute is compared to the group. For a given part
attribute the Z-Score is calculated by taking the absolute value
of the compound minus the mean of the group which is divided by the
standard deviation of the group.`,
}

export const financialFeatureDefinitions = {
    contractPrice: `Price of compounds from SMMART on current contract with supplier`,
    predictedPrice: `Best-in-class price of compounds based on applying an ensemble of neural network and gradient boosted prediction models to compound raw material, geometry, and high-cost processes data.`,
    priceDelta: `Predicted Price minus Contract Price`,
    '5YearForecastQuantity': `Five year aggregate forecasted quantity from SMMART`,
    '5YearForecastSpend': `5yr Forecast Quantity times Contract Price`,
    '5YearPredictedSpend': `5yr Forecast Quantity times Predicted Price`,
    '5YearOpportunitySpend': `5yr Predicted Spend minus 5yr Forecast Spend`,
}
