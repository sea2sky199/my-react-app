import React from 'react'
import { CheckboxFilter, ClickableDiv } from '..'

import {
    camelToHumanCase,
    toTitleCase,
    titleCaseExemptValues
} from '../../utilities'

import './table.css'

function DropdownCell({options, activeFilters, filterMethod, formatTitle, grouping, cellIndex, classNames}) {
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

  const updateFilter = (filter, filterGrouping) => {
        if (activeFilters.includes(filter)) {
            filterMethod(filter, filterGrouping, true)
        } else {
            filterMethod(filter, filterGrouping, false)
        }
    };

  const renderDropdown = (opts) => {
        return (
            <div style={{ position: 'relative' }}>
                <ClickableDiv
                    classNameArr={['filter-dropdown-button', 'flex', 'space-between']}
                    clickAction={() => setOpen(!open)}
                >
                    {formatTitle
                        ? formatTitle(grouping)
                        : toTitleCase(camelToHumanCase(grouping))}
                    <div className={open ? 'filter-dropdown-triangle filter-triangle-flipped' : 'filter-dropdown-triangle'}>
                        <span>&#9660;</span>
                    </div>
                </ClickableDiv>
                {open && (
                    <div className="filter-dropdown-container">
                        {(opts || []).map(option => (
                            <CheckboxFilter
                                key={option}
                                filter={option}
                                grouping={grouping}
                                isActive={activeFilters.includes(option)}
                                updateFilter={updateFilter}
                            />
                        ))}
                    </div>
                )}
            </div>
        )
    };

  const cellClassNames = [...(classNames || []), 'Cell']

  return cellIndex === 0 ? (
            <th
                scope="row"
                className={cellClassNames.join(' ')}
                ref={dropdownContainer}
            >
                {renderDropdown(options)}
            </th>
        ) : (
            <td
                className={cellClassNames.join(' ')}
                ref={dropdownContainer}
            >
                {renderDropdown(options)}
            </td>
        );
}

export default DropdownCell
