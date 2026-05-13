import React from 'react'
import { getFormattedValue } from '../../utilities'

const InfoTable = ({
    compoundInfo,
    headings,
    tableClassName,
    renderFormattedHeading
}) => {
    const info = headings.map((heading, i) => {
        let styleArr = ['semi-thin', 'letter-spacing']
        if (heading === 'compoundNotes') {
            styleArr.push('overflow-wrap')
        }

        return (
            <tr key={i}>
                {renderFormattedHeading(heading)}
                <td className={styleArr.join(' ')}>
                    {getFormattedValue(heading, compoundInfo)}
                </td>
            </tr>
        )
    })

    return (
        <table className={tableClassName}>
            <tbody>{info}</tbody>
        </table>
    )
}

export default React.memo(InfoTable)
