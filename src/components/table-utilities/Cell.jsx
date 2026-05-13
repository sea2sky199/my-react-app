import React from 'react'
import './table.css'

const Cell = ({
    children,
    header,
    cellIndex,
    classNamesArr = [],
    onClick,
    name = undefined
}) => {
    const classNameArr = () => {
        let classNames = [...classNamesArr, 'Cell']
        if (cellIndex === 0) {
            classNames.push('FirstRow')
        }
        return classNames.join(' ')
    }

    return header ? (
        <th
            scope="col"
            name={name}
            className={classNameArr()}
            onClick={onClick}
        >
            {children}
        </th>
    ) : (
        <td name={name} className={classNameArr()} onClick={onClick}>
            {children}
        </td>
    )
}

export default Cell
