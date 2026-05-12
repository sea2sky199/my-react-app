import React from 'react'

import { handleKeyDown } from '../../utilities'

const ClickableDiv = ({
    classNameArr = [],
    name = undefined,
    style = {},
    clickAction,
    children,
    id = null
}) => {
    return (
        <div
            className={[...classNameArr, 'pointer'].join(' ')}
            style={{ ...style }}
            onClick={clickAction}
            onKeyDown={e => handleKeyDown(e, clickAction)}
            tabIndex={0}
            role="button"
            name={name}
            id={id}
        >
            {children}
        </div>
    )
}

export default ClickableDiv
