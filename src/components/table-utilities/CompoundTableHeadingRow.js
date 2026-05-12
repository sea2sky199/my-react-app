import React, { Fragment } from 'react'
import { FilteringRow, Cell, Information, SizeCodeDescription } from '..'

import {
    formatStringContainingMeasurement,
    camelToHumanCase
} from '../../utilities'

import { Icon } from 'react-icons-kit'
import { ic_keyboard_arrow_down } from 'react-icons-kit/md/ic_keyboard_arrow_down'
import { ic_keyboard_arrow_up } from 'react-icons-kit/md/ic_keyboard_arrow_up'

const CompoundTableHeadingRow = ({
    accessors,
    comparisonMethod,
    sort,
    updateSort,
    filterOptions,
    filterRanges,
    getSearchAndFilterCriteria,
    updateFilter,
    updateSearch,
    updateFilterRange
}) => {
    const activelySortedColumn = sort.name

    const headingRow = accessors.map((accessor, cellIndex) => {
        const content = formatStringContainingMeasurement(
            camelToHumanCase(accessor),
            false,
            false,
            <Fragment>
                {accessor === 'sizeCode' && (
                    <Information
                        header="Size Code"
                        eventName="showSizeCode"
                        popOut={false}
                    >
                        <SizeCodeDescription />
                    </Information>
                )}
                {accessor === activelySortedColumn && (
                    <Icon
                        icon={
                            sort.ascending
                                ? ic_keyboard_arrow_down
                                : ic_keyboard_arrow_up
                        }
                        style={{ marginLeft: '1.5rem' }}
                    />
                )}
            </Fragment>,
            false,
            true
        )
        return (
            <Cell
                key={`heading-${accessor}`}
                header={true}
                cellIndex={cellIndex}
                classNamesArr={['compounds-header-cell', 'pointer']}
                onClick={() => {
                    updateSort(accessor)
                }}
            >
                {content}
            </Cell>
        )
    })
    return (
        <thead>
            <tr key="heading" className="h5 letter-spacing">
                {headingRow}
            </tr>
            {filterOptions && (
                <FilteringRow
                    accessors={accessors}
                    comparisonMethod={comparisonMethod}
                    filterOptions={filterOptions}
                    filterRanges={filterRanges}
                    getSearchAndFilterCriteria={getSearchAndFilterCriteria}
                    filterExemptAccessorsArray={['similarityRank']}
                    updateFilter={updateFilter}
                    updateSearch={updateSearch}
                    updateFilterRange={updateFilterRange}
                />
            )}
        </thead>
    )
}

export default CompoundTableHeadingRow
