import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { Cell, CompoundNumberCell } from '..'
import {
    toTitleCase,
    roundToNthDecimal,
    titleCaseExemptValues,
    LongClickAction,
    prefixAccessorsMap,
    prefixValue,
    hasClass
} from '../../utilities'

const CompoundRow = ({
    compoundInfo,
    headings,
    isSimilarityView,
    selectedCompoundStore
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navigateToCompound = compoundNumber => {
        if (!isSimilarityView) {
            navigate(`/compound/${compoundNumber}`, {
                state: {
                    returnToAllCompoundsViewURL: `${location.pathname}${location.search}`,
                    isGridView: false
                }
            })
        } else {
            const firstLevelcompoundNumber = location.pathname
                .slice(1)
                .split('/')[1]

            navigate(`/compound/${compoundNumber}`, {
                state: {
                    ...location.state,
                    firstLevelcompoundNumber: firstLevelcompoundNumber,
                    returnToSimilarCompoundsViewURL: `${location.pathname}${location.search}`,
                    isGridView: false
                }
            })
        }
    }

    const partRowClickActions = compoundInfo => {
        if (selectedCompoundStore && selectedCompoundStore.isMultiSelectView) {
            return {
                onClick: () =>
                    selectedCompoundStore.updateSelectedcompoundNumbers(
                        compoundInfo.compoundNumber
                    )
            }
        } else {
            const LongClick = new LongClickAction(400, () =>
                navigateToCompound(compoundInfo.compoundNumber)
            )
            return {
                onMouseDown: e => LongClick.handleClickDown(e),
                onMouseUp: e => LongClick.handleClickRelease(e)
            }
        }
    }

    return (
        <tr
            className={`h5 pointer ${hasClass(
                ['pointer', true],
                ['multi-select-row', selectedCompoundStore && selectedCompoundStore.isMultiSelectView]
            )}`}
            {...partRowClickActions(compoundInfo)}
        >
            {headings.map((heading, cellIndex) => {
                let value =
                    typeof compoundInfo[heading] === 'number'
                        ? roundToNthDecimal(compoundInfo[heading], 3)
                        : toTitleCase(compoundInfo[heading], titleCaseExemptValues)
                if (
                    value !== undefined &&
                    prefixAccessorsMap.hasOwnProperty(heading)
                ) {
                    value = prefixValue(prefixAccessorsMap[heading], value)
                }
                let content = (
                    <div style={{ paddingLeft: '0.5rem' }}>
                        {value !== undefined ? value : '-'}
                    </div>
                )
                if (heading === 'compoundNumber') {
                    content = <CompoundNumberCell compoundInfo={compoundInfo} />
                }
                return (
                    <Cell
                        key={`${compoundInfo.compoundNumber}-${heading}-cell`}
                        cellIndex={cellIndex}
                    >
                        <div style={{ position: 'relative' }}>
                            {selectedCompoundStore && selectedCompoundStore.isMultiSelectView &&
                                cellIndex === 0 && (
                                    <div
                                        className="flex align-center"
                                        style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '-2.75rem',
                                            height: '100%'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            className="checkbox compound-selection-checkbox"
                                            checked={selectedCompoundStore.selectedcompoundNumbers.includes(
                                                compoundInfo.compoundNumber
                                            )}
                                            readOnly={true}
                                        />
                                    </div>
                                )}
                            {content}
                        </div>
                    </Cell>
                )
            })}
        </tr>
    )
}

export default CompoundRow
