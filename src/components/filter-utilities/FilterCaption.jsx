import React from 'react'
import AppIcon from '../utility-components/AppIcon'
import ClickableDiv from '../utility-components/ClickableDiv'

import { ic_clear } from 'react-icons-kit/md/ic_clear'

const FilterCaption = ({
    classNameArr = [],
    caption,
    removeFilterCallback,
    style = {},
    name = undefined
}) => {
    return (
        <ClickableDiv
            classNameArr={[
                ...classNameArr,
                'flex',
                'align-center',
                'space-between'
            ]}
            clickAction={removeFilterCallback}
            style={style}
            name={name}
        >
            <div style={{ maxWidth: '100%' }}>{caption}</div>
            <AppIcon icon={ic_clear} size={12} style={{ marginTop: '-2px' }} />
        </ClickableDiv>
    )
}

export default FilterCaption
