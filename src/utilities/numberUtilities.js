const isNumeric = string => {
    //JQuery Definition of isNumeric
    return !isNaN(string - parseFloat(string))
}

const prefixValue = (prefix, value) => {
    if (!value && value !== 0) {
        return undefined
    }
    if (value >= 0) {
        return prefix + value.toFixed(2)
    } else {
        return '-' + prefix + Math.abs(value).toFixed(2)
    }
}

const roundToNthDecimal = (value, n = 3) => {
    if (!value && value !== 0) {
        return undefined
    }

    if (typeof value !== 'number') {
        return value
    }

    const roundingConstant = Math.pow(10, n)

    return Math.round(value * roundingConstant) / roundingConstant
}

const isInvalidBems = chemdw => {
    if (chemdw === undefined || !isNumeric(chemdw)) {
        return true
    }
    return false
}

export { roundToNthDecimal, prefixValue, isNumeric, isInvalidBems }
