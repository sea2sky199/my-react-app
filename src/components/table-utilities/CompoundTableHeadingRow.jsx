import React, { Fragment } from 'react'
import AppIcon from '../utility-components/AppIcon'
import Information from '../information-modal/Information'
import SizeCodeDescription from '../information-modal/SizeCodeDescription'
import Cell from './Cell'
import FilteringRow from './FilteringRow'

import {
    formatStringContainingMeasurement,
    camelToHumanCase
} from '../../utilities'

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
                    <AppIcon
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
