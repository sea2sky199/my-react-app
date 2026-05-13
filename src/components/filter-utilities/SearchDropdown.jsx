import React from 'react'

import FilterCaption from './FilterCaption'
import ClickableDiv from '../utility-components/ClickableDiv'
import {
    camelToHumanCase,
    toTitleCase,
    titleCaseExemptValues
} from '../../utilities'

function SearchDropdown({options, activeFilters, filterMethod, grouping, isSelfContained}) {
  const [searchInput, setSearchInput] = React.useState('');
  const [openOverride, setOpenOverride] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const dropdownContainer = React.useRef(null);

  const handleClick = React.useCallback((e) => {
    if (dropdownContainer.current && !dropdownContainer.current.contains(e.target)) {
      setOpenOverride(false)
      setOpen(false)
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClick, false)
    return () => {
      document.removeEventListener('mousedown', handleClick, false)
    };
  }, [handleClick]);

  const formatGroupingTitle = (grouping) => {
        return toTitleCase(camelToHumanCase(grouping))
    };

  const updateFilter = (filter, filterGrouping) => {
        if (activeFilters.includes(filter)) {
            filterMethod(filter, filterGrouping, true)
        } else {
            filterMethod(filter, filterGrouping, false)
        }
    };

  const getSearchFilteredUnselectedOptions = () => (options || []).filter(
            option =>
                !activeFilters.includes(option) &&
                option
                    .toUpperCase()
                    .startsWith(searchInput.toUpperCase())
        );

  const renderSelectedOptions = () => {
        return activeFilters.map(option => {
            const optionString = toTitleCase(option, titleCaseExemptValues)

            return (
                <FilterCaption
                    classNameArr={[
                        'compound-search-dropdown-option',
                        'compound-search-dropdown-selected-option'
                    ]}
                    removeFilterCallback={() =>
                        updateFilter(option, grouping)
                    }
                    key={option}
                    caption={optionString}
                    name={optionString.replace(/\s/g, '-')}
                />
            )
        })
    };

  const renderSearchFilteredUnselectedOptions = () => {
        return getSearchFilteredUnselectedOptions().map(option => {
            const optionString = toTitleCase(option, titleCaseExemptValues)
            return (
                <ClickableDiv
                    classNameArr={[
                        'compound-search-dropdown-option',
                        'flex',
                        'align-center'
                    ]}
                    clickAction={() =>
                        updateFilter(option, grouping)
                    }
                    key={option}
                    name={optionString.replace(/\s/g, '-')}
                >
                    <span>
                        <b>
                            {optionString.slice(
                                0,
                                searchInput.length
                            )}
                        </b>
                        {optionString.slice(searchInput.length)}
                    </span>
                </ClickableDiv>
            )
        })
    };

  const getRenderedSearchResults = () => {
        const searchFilteredOptions = renderSearchFilteredUnselectedOptions()

        if (searchFilteredOptions.length) {
            return searchFilteredOptions
        } else {
            return [
                <div
                    className="compound-search-dropdown-option flex align-center pointer-events-none"
                    key="no-results"
                >
                    No Results Found
                </div>
            ]
        }
    };

  const renderDropdown = () => {
        const dropdownContent = []

        if (isSelfContained) {
            dropdownContent.push(...renderSelectedOptions())
        }

        if (searchInput.length) {
            dropdownContent.push(...getRenderedSearchResults())
        }

        return dropdownContent
    };

  return (
            <div ref={dropdownContainer} style={{ position: 'relative' }}>
                {isSelfContained &&
                activeFilters.length &&
                !openOverride &&
                !searchInput.length ? (
                    <ClickableDiv
                        classNameArr={[
                            'filter-dropdown-button',
                            'flex',
                            'space-between',
                            'active-filter-button'
                        ]}
                        clickAction={() =>
                            setOpenOverride(true)
                        }
                    >
                        <div
                            style={{
                                width: 'calc( 100% - 1rem )',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {`${activeFilters.length} ${
                                activeFilters.length > 1
                                    ? 'Filters'
                                    : 'Filter'
                            } Applied`}
                        </div>
                        <div
                            style={{ width: '1rem' }}
                            className="flex justify-center align-center"
                        >
                            <div
                                className={
                                    open
                                        ? 'filter-dropdown-triangle filter-triangle-flipped'
                                        : 'filter-dropdown-triangle'
                                }
                            >
                                <span>&#9660;</span>
                            </div>
                        </div>
                    </ClickableDiv>
                ) : (
                    <input
                        style={{
                            width: '100%',
                            paddingLeft: '0.5rem',
                            color: '#999999'
                        }}
                        className="compounds-search-input"
                        id={`${grouping}-search-input`}
                        placeholder={`Type ${formatGroupingTitle(
                            grouping
                        )}...`}
                        value={searchInput}
                        onChange={e =>
                            setSearchInput(e.target.value)
                        }
                    />
                )}
                {(!!searchInput.length ||
                    openOverride) && (
                    <div className="filter-dropdown-container">
                        {renderDropdown()}
                    </div>
                )}
            </div>
        );
}

export default SearchDropdown
