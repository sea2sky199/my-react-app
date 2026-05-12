import React from 'react'

import { SearchDropdown } from '..'

import './table.css'

const SearchDropdownCell = props => {
    return (
        <td className={props.classNames.join(' ')}>
            <SearchDropdown {...props} isSelfContained={true} />
        </td>
    )
}

export default SearchDropdownCell
