import React from 'react'
import './toggle-switch.css'
import { hasClass } from '../../utilities'

const ToggleSwitch = ({ checked, toggle, style = undefined }) => {
    return (
        <label
            className={`switch h6 ${hasClass(['semi-bold', checked])}`}
            style={style}
        >
            <input type="checkbox" checked={checked} onChange={toggle}></input>
            <span className="slider">Multi Select</span>
        </label>
    )
}

export default ToggleSwitch
