import React from 'react'


export const ColumnConfigCaptions = ({ columnConfig }) => {
    const columnConfigCaptions = Array.from(columnConfig.values())
        .filter(({ visible, editable }) => !visible && editable)
        .map(({ title }) => title)
    return (<div>
        <div className="h6 bold">Hidden Columns:</div>
        <div
            className="grid-filter-captions h6"
            style={{ paddingTop: '0.5rem' }}
        >
            {columnConfigCaptions}
        </div>
    </div>)
}
