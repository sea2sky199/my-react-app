import React from 'react'

import { ClickableDiv } from '..'
import { camelToHumanCase } from '../../utilities'
import './filter-utilities.css'

function SearchWithAccessorSelect({activeSearch, options, searchMethod}) {
  const allOptions = ['all', ...(options || [])];
  const [selected, setSelected] = React.useState(allOptions[0]);
  const [selectionOpen, setSelectionOpen] = React.useState(false);
  const prevSelectedRef = React.useRef();
  const dropdownRef = React.useRef(null);

  const handleClick = React.useCallback((e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setSelectionOpen(false)
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClick, false)
    return () => {
      document.removeEventListener('mousedown', handleClick, false)
    };
  }, [handleClick]);

  React.useEffect(() => {
    const selectedAccessorChange =
            prevSelectedRef.current && prevSelectedRef.current !== selected
        const inputEl = document.getElementById('grid-keyword-search-input')
        const inputValue = inputEl ? inputEl.value : ''
        if (selectedAccessorChange && inputValue !== '') {
            updateSearchFromGrid(inputValue, selected)
        }
    prevSelectedRef.current = selected;
  }, [selected]);

  const updateSearchFromGrid = (value, grouping) => {
        value = value.toUpperCase()
        searchMethod(value, grouping, false, 'search')
    };

  const renderOptions = (opts) => {
        return opts.map(option => (
            <ClickableDiv
                key={option}
                classNameArr={['h7', 'semi-bold', 'grid-keyword-search-option']}
                clickAction={() => {
                    setSelected(option)
                    setSelectionOpen(false)
                }}
            >
                {camelToHumanCase(option)}
            </ClickableDiv>
        ))
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
                    ref={dropdownRef}
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
                        renderOptions(allOptions)}
                </div>
            </div>
        );
}

export default SearchWithAccessorSelect
