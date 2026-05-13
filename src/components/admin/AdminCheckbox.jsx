import React from 'react'

const AdminCheckbox = ({
    className,
    header,
    label,
    checked,
    onChange,
    inputName = undefined
}) => {
    return (
        <div className={className}>
            <div className="h5 bold letter-spacing">{header}</div>
            <label className="checkbox-container flex align-center">
                <input
                    name={inputName}
                    className="checkbox"
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                />
                <div
                    className="h5 checkbox-label"
                    style={{
                        marginTop: '-1px',
                        paddingLeft: '0.5rem'
                    }}
                >
                    {label}
                </div>
            </label>
        </div>
    )
}

export default AdminCheckbox
