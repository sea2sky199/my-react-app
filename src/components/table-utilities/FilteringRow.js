import React from 'react'

import { numericCompare, stringCompare } from '../../utilities'

import DropdownCell from './DropdownCell'
import RangeFilterCell from './RangeFilterCell'
import SearchDropdownCell from './SearchDropdownCell'

const FilteringRow = ({
    accessors,
    comparisonMethod = (accessor, filterOptions) =>
        (a, b) =>
            numericCompare(
                filterOptions[accessor][a],
                filterOptions[accessor][b]
            ),
    filterOptions,
    filterRanges = {},
    getSearchAndFilterCriteria,
    updateFilter,
    updateSearch,
    updateFilterRange,
    filterExemptAccessorsArray = [],
    formatTitle
}) => {
    const { filterMap, searchMap, rangeMap } = getSearchAndFilterCriteria()

    accessors = accessors.map(accessor => {
        let accessorObj = { name: accessor }
        if (accessor === 'supplierName') {
            accessorObj.type = 'searchDropdown'
        } else if (filterOptions[accessor]) {
            accessorObj.type = 'dropdown'
        } else if (filterRanges[accessor]) {
            accessorObj.type = 'range'
        } else {
            accessorObj.type = 'search'
        }
        if (filterExemptAccessorsArray.includes(accessor)) {
            accessorObj.type = 'none'
        }
        return accessorObj
    })

    const getOptions = (accessor) => {
        if (filterOptions[accessor]) {
            return Object.keys(filterOptions[accessor]).sort(comparisonMethod(accessor, filterOptions))
        } else {
            return []
        }
    }

    return (
        <tr key={`row-filters`} className="h6">
            {accessors.map((accessorObj, cellIndex) => {
                const accessor = accessorObj.name
                const type = accessorObj.type
                const classNames =
                    cellIndex === 0
                        ? ['filter-cell Cell FirstRow']
                        : ['filter-cell Cell']
                if (type === 'dropdown') {
                    return (
                        <DropdownCell
                            grouping={accessor}
                            activeFilters={filterMap[accessor] || []}
                            filterMethod={updateFilter}
                            classNames={classNames}
                            key={`${accessor}-filters`}
                            cellIndex={cellIndex}
                            options={getOptions(accessor)}
                            multiSelection={true}
                            formatTitle={formatTitle}
                        />
                    )
                } else if (type === 'range') {
                    return (
                        <RangeFilterCell
                            grouping={accessor}
                            range={filterRanges[accessor]}
                            activeRange={rangeMap[accessor]}
                            classNames={classNames}
                            key={`${accessor}-filters`}
                            updateRangeMethod={updateFilterRange}
                            firstCell={cellIndex === 0}
                        />
                    )
                } else if (type === 'search') {
                    return (
                        <td
                            key={`${accessor}-filters`}
                            className={classNames.join(' ')}
                        >
                            <input
                                style={{
                                    width: '100%',
                                    paddingLeft: '0.5rem',
                                    color: '#999999'
                                }}
                                className="compounds-search-input"
                                id={`${accessor}-search-input`}
                                placeholder="Search..."
                                defaultValue={searchMap[accessor] || ''}
                                onKeyUp={e => {
                                    updateSearch(
                                        e.target.value.toUpperCase(),
                                        accessor
                                    )
                                }}
                            />
                        </td>
                    )
                } else if (type === 'searchDropdown') {
                    return (
                        <SearchDropdownCell
                            key={`${accessor}-filters`}
                            grouping={accessor}
                            activeFilters={filterMap[accessor] || []}
                            filterMethod={updateFilter}
                            classNames={classNames}
                            cellIndex={cellIndex}
                            options={getOptions(accessor, stringCompare)}
                        />
                    )
                } else {
                    return (
                        <td
                            key={`${accessor}-filter-exempt`}
                            className={classNames.join(' ')}
                        ></td>
                    )
                }
            })}
        </tr>
    )
}

export default FilteringRow
