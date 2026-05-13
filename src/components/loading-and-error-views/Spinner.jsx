import React from 'react'
import logoSpinner from '../../images/logoSpinner.svg'
import './loading-and-error-view.css'

const Spinner = ({ size = 40, style }) => {
    return (
        <img
            className="logo-spinner"
            src={logoSpinner}
            alt=""
            style={{
                display: 'block',
                height: `${size}px`,
                width: `${size}px`,
                marginLeft: 'auto',
                marginRight: 'auto',
                ...style
            }}
        />
    )
}

export default Spinner
