import React from 'react'

import {
    camelToHumanCase,
    formatStringContainingMeasurement,
    toTitleCase,
    titleCaseExemptValues
} from '../../utilities'

import './filter-utilities.css'

const FilterCaptions = ({ filterMap, rangeMap, searchMap }) => {
    const roundRangeToHundreths = range => {
        //range in format [min, max]
        return range.map((val, i) => {
            if (i === 0) {
                //min should be floor
                return Math.floor(val * 100) / 100
            } else {
                //max should be ceil
                return Math.ceil(val * 100) / 100
            }
        })
    }

    let filterCaptions = []
    Object.keys(filterMap).forEach(accessor => {
        const header = camelToHumanCase(accessor).replace('Compound ', '')
        const values = filterMap[accessor]
        values.forEach((value, i) => {
            filterCaptions.push(
                <div key={`grid-filter-${accessor}-${i}`}>
                    <div
                        style={{ maxWidth: '100%' }}
                    >{`${header}: ${toTitleCase(
                        value,
                        titleCaseExemptValues
                    )}`}</div>
                </div>
            )
        })
    })

    Object.keys(rangeMap).forEach((accessor, i) => {
        const value = roundRangeToHundreths(rangeMap[accessor]).join(', ')

        const caption = formatStringContainingMeasurement(
            camelToHumanCase(accessor),
            false,
            '',
            `: ${value}`
        )
        filterCaptions.push(
            <div key={`grid-filter-${accessor}-${i}`}>
                <div style={{ maxWidth: '100%' }}>{caption}</div>
            </div>
        )
    })

    Object.keys(searchMap).forEach((accessor, i) => {
        const header = camelToHumanCase(accessor)
        filterCaptions.push(
            <div key={`grid-filter-${accessor}-${i}`}>
                <div
                    style={{ maxWidth: '100%' }}
                >{`Keyword(${header}): ${searchMap[accessor]}`}</div>
            </div>
        )
    })

    const areFiltersApplied = !!filterCaptions.length

    return (
        areFiltersApplied && (
            <div>
                <div className="h6 bold">Filtered By:</div>
                <div
                    className="grid-filter-captions h6"
                    style={{ paddingTop: '0.5rem' }}
                >
                    {filterCaptions}
                </div>
            </div>
        )
    )
}

export default FilterCaptions
