import React, { Component } from 'react'
import { ClickableDiv } from '..'
import './utilities.css'

import { Icon } from 'react-icons-kit'
import { elevator } from 'react-icons-kit/iconic/elevator'

function DropdownSelect({options, defaultOption, style, id, formatSelected, selectCallback, formatOption}) {
  const [options, setOptions] = React.useState(this.options || []);
  const [selected, setSelected] = React.useState(this.defaultOption);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClick, false)
    
    return () => {
      document.removeEventListener('mousedown', handleClick, false)
    };
  }, []);

  return (
            <div
                ref={node => (dropdownContainer = node)}
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
                                        setSelected({
                                            selected: option,
                                            open: false
                                        })
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
