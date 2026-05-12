import React, { Component } from 'react'
import { RangeFilter, ClickableDiv } from '..'

import './slider.css'
import './table.css'

import {
    camelToHumanCase,
    formatStringContainingMeasurement
} from '../../utilities'

function RangeFilterCell({activeRange, classNames, grouping, firstCell, range, updateRangeMethod}) {
  const [open, setOpen] = React.useState(false);
  const [minRange, setMinRange] = React.useState(null);
  const [maxRange, setMaxRange] = React.useState(null);
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClick, false)
    
    return () => {
      document.removeEventListener('mousedown', handleClick, false)
    };
  }, []);
  React.useEffect(() => {
    if (activeRange && !activeRange) {
            let activeRange = [minRange, maxRange]
            activeRange = roundRangeToHundreths(activeRange)
            this.setState({
                minInput: activeRange[0],
                maxInput: activeRange[1]
            })
        }
  }, [activeRange, classNames, grouping, firstCell, range, updateRangeMethod, minRange, maxRange]);

  const classNames = [...classNames, 'Cell']

        const activeRange = activeRange || []
        const roundedRange = activeRange.length
            ? roundRangeToHundreths(activeRange)
            : roundRangeToHundreths([
                  minRange,
                  maxRange
              ])

        const dropdownClassNames = [
            'filter-dropdown-button',
            'flex',
            'space-between'
        ]
        if (activeRange.length) {
            dropdownClassNames.push(`active-filter-button`)
        }

        const getHeading = grouping => {
            if (grouping === 'similarityRank') {
                grouping = 'sim.Rank'
            }
            return formatHeading(grouping)
        }

        return (
            <td
                className={classNames.join(' ')}
                ref={node => (dropdownContainer = node)}
            >
                <div style={{ position: 'relative' }}>
                    <ClickableDiv
                        classNameArr={dropdownClassNames}
                        name={`${grouping}-range-filter`}
                        clickAction={() =>
                            setOpen(!open)
                        }
                    >
                        {activeRange.length
                            ? roundedRange.join(', ')
                            : getHeading(grouping)}
                        <div
                            className={
                                open
                                    ? 'filter-dropdown-triangle filter-triangle-flipped'
                                    : 'filter-dropdown-triangle'
                            }
                        >
                            <span>&#9660;</span>
                        </div>
                    </ClickableDiv>
                    {open && (
                        <div
                            className={
                                firstCell
                                    ? 'filter-dropdown-container-first'
                                    : 'filter-dropdown-container'
                            }
                        >
                            <RangeFilter
                                grouping={grouping}
                                range={range}
                                activeRange={activeRange}
                                updateRangeMethod={updateRangeMethod}
                            />
                        </div>
                    )}
                </div>
            </td>
        );
}

export default RangeFilterCell
