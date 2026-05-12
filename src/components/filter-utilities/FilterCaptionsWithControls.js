import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { FilterCaption, ClickableDiv } from '..'
import {
    camelToHumanCase,
    formatStringContainingMeasurement,
    toTitleCase,
    titleCaseExemptValues
} from '../../utilities'

import './filter-utilities.css'

const FilterCaptionsWithControls = ({
    filterMap,
    updateFilter,
    rangeMap,
    updateFilterRange,
    searchMap,
    updateSearch
}) => {
    const navigate = useNavigate();
    const location = useLocation();
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

    const clearAllFilters = () => {
        navigate(location.pathname, {
            state: { ...location.state }
        })
    }

    const classNamesArr = ['grid-filter-caption-container']

    let filterCaptions = []
    Object.keys(filterMap).forEach(accessor => {
        const header = camelToHumanCase(accessor).replace('Compound ', '')
        const values = filterMap[accessor]
        values.forEach((value, i) => {
            filterCaptions.push(
                <FilterCaption
                    key={`grid-filter-${accessor}-${i}`}
                    classNameArr={classNamesArr}
                    caption={`${header}: ${toTitleCase(
                        value,
                        titleCaseExemptValues
                    )}`}
                    removeFilterCallback={() =>
                        updateFilter(value, accessor, true)
                    }
                />
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
            <FilterCaption
                key={`grid-filter-${accessor}`}
                classNameArr={classNamesArr}
                caption={caption}
                removeFilterCallback={() =>
                    updateFilterRange(rangeMap[accessor], accessor, true)
                }
            />
        )
    })

    Object.keys(searchMap).forEach(accessor => {
        const header = camelToHumanCase(accessor)
        filterCaptions.push(
            <FilterCaption
                key={`grid-filter-${accessor}`}
                classNameArr={classNamesArr}
                caption={`Keyword(${header}): ${searchMap[accessor]}`}
                removeFilterCallback={() => updateSearch('', accessor)}
            />
        )
    })

    const areFiltersApplied = !!filterCaptions.length

    return (
        areFiltersApplied && (
            <div className="grid-filter-captions-container">
                <div className="h6 flex space-between align-center">
                    <div className="bold">Filtered By:</div>
                    <ClickableDiv
                        style={{ color: '#ef88b8' }}
                        clickAction={clearAllFilters}
                    >
                        Clear All
                    </ClickableDiv>
                </div>
                <div
                    className="grid-filter-captions h6"
                    style={{ paddingTop: '1rem' }}
                >
                    {filterCaptions}
                </div>
            </div>
        )
    )
}

export default FilterCaptionsWithControls
