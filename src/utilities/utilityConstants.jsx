import React, { Fragment } from 'react'
import moment from 'moment'

const getChemDWProprietary = (addTimestamp = false, removeHeading = false) =>
    `${
        removeHeading
            ? ''
            : 'ChemDW, Proprietary. '} Access restricted   ${
        addTimestamp ? moment().format('LLL') : ''
    }`

const titleCaseExemptValues = [
    'NMA',
    'CHEM',
]

const titleCaseExemptAccessors = ['compoundNumber', 'compoundNumberClean']

const prefixAccessorsMap = {
    unitPrice: '$',
    contractPrice: '$',
    predictedPrice: '$',
    '5YearPredictedOpportunity': '$',
}

const unreleasedPrograms = ['NMA']

const columnNameToDisplayedNameMap = { compoundNumberVersion: 'revision' }

const contactEmail = 'chemmatch@chemdw.com'

const version = 'V1.0.0'

const siteName = 'ChemMatch'

const encodedNewLine = '%0d'

const tabJSX = <Fragment>&nbsp;&nbsp;&nbsp;&nbsp;</Fragment>

const measurementMap = {
    Inches: 'in',
    Pounds: 'lb',
}

const baseImageURL =
    'https://chemdw.com/ords/f?p=110:65:::::P65_FILE_NAME:'

const partIsometricImage = (compoundNumberClean) =>
    `${baseImageURL}${compoundNumberClean}_Isometric.jpg`

const MAX_RESULTS = 999

const EXCLUDED_NOTES = new Set(['compound_number', 'compound_name', 'model'])

export {
    getChemDWProprietary,
    baseImageURL,
    partIsometricImage,
    titleCaseExemptAccessors,
    titleCaseExemptValues,
    prefixAccessorsMap,
    unreleasedPrograms,
    columnNameToDisplayedNameMap,
    contactEmail,
    version,
    siteName,
    encodedNewLine,
    tabJSX,
    measurementMap,
    MAX_RESULTS,
    EXCLUDED_NOTES,
}
