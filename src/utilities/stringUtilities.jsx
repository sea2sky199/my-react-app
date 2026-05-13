import React from 'react'
import { measurementMap } from './utilityConstants'

const camelToHumanCase = str => {
    if (!str) {
        return undefined
    }

    if (typeof str !== 'string') {
        return str
    }

    str = str.trim()

    if (!str) {
        return undefined
    }

    return str.replace(/([A-Z])/g, ' $1').replace(/^./, function(letter) {
        return letter.toUpperCase()
    })
}

const snakeToHumanCase = str => {
    if (!str) {
        return undefined
    }

    if (typeof str !== 'string') {
        return str
    }

    str = str.trim()

    if (!str) {
        return undefined
    }

    return str.replace(/_/g, ' ').replace(/^./, function(letter) {
        return letter.toUpperCase()
    })
}

const toTitleCase = (str, exemptArray = []) => {
    if (!str && str !== 0) {
        return undefined
    }

    if (typeof str !== 'string') {
        return str
    }

    str = str.trim()

    if (!str) {
        return undefined
    }

    if (exemptArray.includes(str)) {
        return str
    }

    return str
        .toLowerCase()
        .split(/\s+/)
        .map(word => {
            word = word.trim()
            return word[0].toUpperCase() + word.slice(1)
        })
        .join(' ')
}

const formatPower = d => {
    const superscript = '⁰¹²³⁴⁵⁶⁷⁸⁹'
    return (d + '').split('').map(function(c) {
        return superscript[c]
    })
}

const formatStringContainingMeasurement = (
    str,
    allCaps = false,
    prepend = '',
    append = '',
    removeMeasurement = false,
    returnJSX = false
) => {
    if (!str) {
        return undefined
    }

    if (typeof str !== 'string') {
        return str
    }

    str = str.trim()

    if (!str) {
        return undefined
    }

    str = toTitleCase(str)
    let measurementStr = ''
    Object.keys(measurementMap).forEach(measurement => {
        const indexOfFirst = str.indexOf(measurement)
        if (indexOfFirst > -1) {
            if (removeMeasurement) {
                str = str.slice(0, indexOfFirst - 1)
            } else {
                const superscript = parseInt(
                    str[indexOfFirst + measurement.length]
                )
                str = str.slice(0, indexOfFirst)
                measurementStr = `(${measurementMap[measurement]}${
                    superscript ? formatPower(superscript) : ''
                })`
            }
        }
    })

    if (allCaps) {
        str = str.toUpperCase()
    }

    return returnJSX ? (
        <div>
            {prepend}
            {str}
            <span style={{ fontWeight: 'normal' }}>{measurementStr}</span>
            {append}
        </div>
    ) : (
        `${prepend}${str}${measurementStr}${append}`
    )
}

export {
    camelToHumanCase,
    snakeToHumanCase,
    toTitleCase,
    formatStringContainingMeasurement
}
