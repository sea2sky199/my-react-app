import React from 'react'

const AdminSelect = ({
    optionsMap,
    selected,
    update,
    title,
    titleClassNamesArr = ['h5'],
    labelClassNamesArr = ['h5'],
    labelStyle = {},
    className = undefined,
    style = undefined,
    isError
}) => {
    const renderSelect = () => {
        const options = Object.keys(optionsMap)
        return options.map(option => {
            const isSelected = optionsMap[option] === selected
            return (
                <label
                    key={`admin-select-option-${option}`}
                    className={[
                        'letter-spacing',
                        'flex',
                        'align-center',
                        'radio-spacing',
                        ...labelClassNamesArr
                    ].join(' ')}
                    style={labelStyle}
                >
                    <input
                        className="radio-button"
                        type="radio"
                        name="option"
                        value={optionsMap[option]}
                        checked={isSelected}
                        onChange={() => {
                            update(optionsMap[option])
                        }}
                    />
                    <div className="radio-label">{option}</div>
                </label>
            )
        })
    }

    return (
        <div className={className} style={style}>
            <div
                className={[
                    'radio-spacing',
                    'letter-spacing',
                    ...titleClassNamesArr
                ].join(' ')}
            >
                {title}
            </div>
            <form>{renderSelect()}</form>
            {isError && (
                <div className="h7 error">Error: Unable To Update Role</div>
            )}
        </div>
    )
}

export default AdminSelect
