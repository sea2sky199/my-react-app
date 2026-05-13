import React from 'react'
import RangeFilter from '../filter-utilities/RangeFilter'
import ClickableDiv from '../utility-components/ClickableDiv'

import './slider.css'
import './table.css'

import {
    camelToHumanCase,
    formatStringContainingMeasurement
} from '../../utilities'

function RangeFilterCell({activeRange, classNames, grouping, firstCell, range, updateRangeMethod}) {
  const [open, setOpen] = React.useState(false);
  const dropdownContainer = React.useRef(null);

  const handleClick = React.useCallback((e) => {
    if (dropdownContainer.current && !dropdownContainer.current.contains(e.target)) {
      setOpen(false)
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClick, false)
    return () => {
      document.removeEventListener('mousedown', handleClick, false)
    };
  }, [handleClick]);

  const roundRangeToHundreths = (rangeArr) => {
        return rangeArr.map((val, i) => {
            if (i === 0) {
                return Math.floor(val * 100) / 100
            } else {
                return Math.ceil(val * 100) / 100
            }
        })
    };

  const formatHeading = (heading) => {
        return formatStringContainingMeasurement
            ? formatStringContainingMeasurement(camelToHumanCase(heading))
            : camelToHumanCase(heading)
    };

  const getHeading = (g) => {
        if (g === 'similarityRank') {
            g = 'sim.Rank'
        }
        return formatHeading(g)
    };

  const cellClassNames = [...(classNames || []), 'Cell']

        const currentActiveRange = activeRange || []
        const roundedRange = currentActiveRange.length
            ? roundRangeToHundreths(currentActiveRange)
            : null

        const dropdownClassNames = [
            'filter-dropdown-button',
            'flex',
            'space-between'
        ]
        if (currentActiveRange.length) {
            dropdownClassNames.push(`active-filter-button`)
        }

        return (
            <td
                className={cellClassNames.join(' ')}
                ref={dropdownContainer}
            >
                <div style={{ position: 'relative' }}>
                    <ClickableDiv
                        classNameArr={dropdownClassNames}
                        name={`${grouping}-range-filter`}
                        clickAction={() =>
                            setOpen(!open)
                        }
                    >
                        {currentActiveRange.length
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
                                activeRange={currentActiveRange}
                                updateRangeMethod={updateRangeMethod}
                            />
                        </div>
                    )}
                </div>
            </td>
        );
}

export default RangeFilterCell
