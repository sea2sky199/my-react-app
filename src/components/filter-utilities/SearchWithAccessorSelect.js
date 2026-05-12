import React, { Component } from 'react'

import { ClickableDiv } from '..'
import { camelToHumanCase } from '../../utilities'
import './filter-utilities.css'

function SearchWithAccessorSelect({activeSearch, options, searchMethod}) {
  const [options, setOptions] = React.useState(['all', ...this.options]);
  const [selected, setSelected] = React.useState(preSelection);
  const [selectionOpen, setSelectionOpen] = React.useState(false);
  const prevSelectedRef = React.useRef();
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClick, false)
    
    return () => {
      document.removeEventListener('mousedown', handleClick, false)
    };
  }, []);
  React.useEffect(() => {
    const selectedAccessorChange =
            prevSelectedRef.current && prevSelectedRef.current !== selected
        const inputValue = document.getElementById('grid-keyword-search-input')
            .value
        if (selectedAccessorChange && inputValue !== '') {
            const inputValue = document.getElementById(
                'grid-keyword-search-input'
            ).value
            updateSearchFromGrid(inputValue, selected)
        }
    prevSelectedRef.current = selected;
  }, [activeSearch, options, searchMethod, selected]);

  const updateSearchFromGrid = (value, grouping) => {
        value = value.toUpperCase()
        searchMethod(value, grouping, false, 'search')
    };

  const inputDefaultValue = activeSearch.length
            ? activeSearch[0][selected]
            : ''

        return (
            <div className="flex">
                <input
                    style={{
                        width: '52%',
                        height: '1.7rem',
                        marginBottom: '1rem',
                        paddingLeft: '0.5rem',
                        color: '#999999'
                    }}
                    id="grid-keyword-search-input"
                    className="compounds-search-input"
                    placeholder="Search..."
                    defaultValue={inputDefaultValue}
                    onKeyUp={e => {
                        updateSearchFromGrid(
                            e.target.value,
                            selected
                        )
                    }}
                />
                <div
                    className="grid-keyword-search-select nowrap"
                    ref={node => (dropdownContainer = node)}
                >
                    <div
                        className="h7 semi-bold flex space-between"
                        onClick={() =>
                            setSelectionOpen(!selectionOpen)
                        }
                    >
                        {camelToHumanCase(selected)}
                        <div
                            className={
                                selectionOpen
                                    ? 'filter-dropdown-triangle filter-triangle-flipped'
                                    : 'filter-dropdown-triangle'
                            }
                        >
                            <span>&#9660;</span>
                        </div>
                    </div>
                    {selectionOpen &&
                        renderOptions(options)}
                </div>
            </div>
        );
}

export default SearchWithAccessorSelect
