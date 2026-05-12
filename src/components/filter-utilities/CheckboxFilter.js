import React from 'react'
import { toTitleCase, titleCaseExemptValues } from '../../utilities'

const CheckboxFilter = ({ grouping, options, activeFilters, updateFilter }) => {
    return options.map((option, i) => {
        return (
            <div 
                className="checkbox-container flex align-center"
                data-grouping={grouping}
                data-option={option}
                key={i}
            >
                <label style={{ width: '100%' }}>
                    <input
                        className="checkbox"
                        type="checkbox"
                        name={option}
                        key={i}
                        onChange={() => updateFilter(option, grouping)}
                        checked={!!activeFilters.includes(option)}
                    />
                    <div className="checkbox-label">
                        {toTitleCase(
                            option.toUpperCase(),
                            titleCaseExemptValues
                        )}
                    </div>
                </label>
            </div>
        )
    })
}

export default CheckboxFilter
