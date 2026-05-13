import React from 'react'

import Spinner from '../loading-and-error-views/Spinner'

const TextInput = ({
    classNamesArr = [],
    value,
    onChange,
    maxChar,
    charTypeRegex,
    isLoading,
    errorMessage
}) => {
    if (typeof maxChar !== 'number' || maxChar < 1) {
        maxChar = undefined
    }

    if (!(charTypeRegex instanceof RegExp)) {
        charTypeRegex = undefined
    }

    const extract = (str, pattern) => str.replace(pattern, '')

    const inputChange = e => {
        if (charTypeRegex) {
            e.target.value = extract(e.target.value, charTypeRegex)
        }
        if (maxChar) {
            e.target.value = e.target.value.slice(0, maxChar)
        }
        if (e.target.value === value) {
            return
        }
        onChange(e)
    }

    return (
        <div style={{ position: 'relative' }}>
            {maxChar !== undefined && (
                <div
                    className="h6-5"
                    style={{
                        position: 'absolute',
                        top: '-0.8rem',
                        right: '0',
                        padding: '0 0.2rem',
                        color: '#999'
                    }}
                >{`${value.length}/${maxChar}`}</div>
            )}
            <input
                type="text"
                className={classNamesArr.join(' ')}
                value={value}
                onChange={inputChange}
            />
            {isLoading && (
                <div
                    className="flex align-center"
                    style={{
                        position: 'absolute',
                        right: '0.25rem',
                        top: '0',
                        height: 'calc( 100% - 1rem)'
                    }}
                >
                    <Spinner size={18} />
                </div>
            )}
            {!!errorMessage && (
                <div className="error h7" style={{ marginTop: '-0.8rem' }}>
                    {errorMessage}
                </div>
            )}
        </div>
    )
}

export default TextInput
