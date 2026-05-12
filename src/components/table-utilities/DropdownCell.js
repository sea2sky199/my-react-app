import React, { Component } from 'react'
import { CheckboxFilter, ClickableDiv } from '..'

import {
    camelToHumanCase,
    toTitleCase,
    titleCaseExemptValues
} from '../../utilities'

import './table.css'

function DropdownCell({options, activeFilters, filterMethod, formatTitle, grouping, cellIndex, classNames}) {
  const [options, setOptions] = React.useState(this.options || []);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClick, false)
    
    return () => {
      document.removeEventListener('mousedown', handleClick, false)
    };
  }, []);

  const updateFilter = (filter, grouping) => {
        const activeFilters = activeFilters
        if (activeFilters.includes(filter)) {
            filterMethod(filter, grouping, true)
        } else {
            filterMethod(filter, grouping, false)
        }
    };

  return cellIndex === 0 ? (
            // adds scope "row" to first cell of tbody row
            <th
                scope="row"
                className={classNames.join(' ')}
                ref={node => (dropdownContainer = node)}
            >
                {renderDropdown(options)}
            </th>
        ) : (
            <td
                className={classNames.join(' ')}
                ref={node => (dropdownContainer = node)}
            >
                {renderDropdown(options)}
            </td>
        );
}

export default DropdownCell
