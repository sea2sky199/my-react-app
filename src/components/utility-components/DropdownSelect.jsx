import React from 'react'
import ClickableDiv from './ClickableDiv'
import './utilities.css'

import { Icon } from 'react-icons-kit'
import { elevator } from 'react-icons-kit/iconic/elevator'

function DropdownSelect({options, defaultOption, style, id, formatSelected, selectCallback, formatOption}) {
  const [selected, setSelected] = React.useState(defaultOption);
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  const handleClick = React.useCallback((e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false)
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClick, false)
    return () => {
      document.removeEventListener('mousedown', handleClick, false)
    };
  }, [handleClick]);

  return (
            <div
                ref={dropdownRef}
                style={{
                    position: 'relative',
                    ...style
                }}
            >
                <ClickableDiv
                    classNameArr={[
                        'all-compounds-dropdown-button',
                        'flex',
                        'space-between',
                        'align-center',
                        'h6',
                        'semi-thin'
                    ]}
                    clickAction={() =>
                        setOpen(!open)
                    }
                    id={id}
                >
                    {formatSelected
                        ? formatSelected(selected)
                        : selected}
                    <Icon
                        icon={elevator}
                        size={12}
                        style={{
                            float: 'right',
                            color: '#999999',
                            transform: 'scale(0.5,0.75)'
                        }}
                    />
                </ClickableDiv>
                {open && (
                    <div className="all-compounds-dropdown-container h6-5 semi-bold letter-spacing">
                        {options.map(option => {
                            const classNames = [
                                'dropdown-select-option',
                                'flex-column',
                                'justify-center'
                            ]
                            if (selected === option) {
                                classNames.push('dropdown-select-option-active')
                            }
                            return (
                                <ClickableDiv
                                    classNameArr={classNames}
                                    key={option}
                                    clickAction={() => {
                                        selectCallback(option)
                                        setSelected(option)
                                        setOpen(false)
                                    }}
                                >
                                    {formatOption
                                        ? formatOption(option)
                                        : option}
                                </ClickableDiv>
                            )
                        })}
                    </div>
                )}
            </div>
        );
}

export default DropdownSelect
