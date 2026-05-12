import { scaleLinear, scalePoint, scaleOrdinal, scaleBand } from 'd3-scale'
import { quantize } from 'd3-interpolate'

const getScalePoint = (fullDomain, range, padding = 0) => {
    return scalePoint()
        .domain(fullDomain)
        .range(range)
        .padding(padding)
}

const getLinearScale = (fullDomain, range) => {
    return scaleLinear()
        .domain([Math.min(...fullDomain), Math.max(...fullDomain)])
        .range(range)
}

const getColorScaleOrdinal = (colorInterpolator, groupings) => {
    return scaleOrdinal(quantize(colorInterpolator, groupings))
}

const getBandScale = (fullDomain, range, paddingOuter = 0) => {
    return scaleBand()
        .domain(fullDomain)
        .rangeRound(range)
        .paddingOuter(paddingOuter)
}

export { getScalePoint, getLinearScale, getColorScaleOrdinal, getBandScale }
