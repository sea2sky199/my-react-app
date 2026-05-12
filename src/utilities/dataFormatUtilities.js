import {
    toTitleCase,
    titleCaseExemptValues,
    titleCaseExemptAccessors,
    prefixAccessorsMap,
    prefixValue
} from './'

export const getFormattedValue = (heading, compoundInfo) => {
    const preliminaryValue = compoundInfo[heading]
    if (!preliminaryValue && preliminaryValue !== 0) {
        return '-'
    }
    if (heading === 'onContract') {
        let formattedBool = preliminaryValue ? 'Yes' : 'No'
        return formattedBool
    } else if (typeof preliminaryValue === 'number') {
        return getNumberValue(heading, preliminaryValue)
    } else if (typeof preliminaryValue === 'string') {
        return titleCaseExemptAccessors.includes(heading)
            ? preliminaryValue
            : toTitleCase(preliminaryValue, titleCaseExemptValues)
    } else {
        return undefined
    }
}

const getNumberValue = (heading, value) => {
    if (prefixAccessorsMap.hasOwnProperty(heading)) {
        return prefixValue(prefixAccessorsMap[heading], value)
    }
    return value.toFixed(3)
}
