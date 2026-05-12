import React from 'react'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

import { Cell, compoundNumberCell } from '..'
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
    history,
    isSimilarityView,
    selectedCompoundStore
}) => {
    const navigateToCompound = compoundNumber => {
        if (!isSimilarityView) {
            history.push(`/compound/${compoundNumber}`, {
                returnToAllCompoundsViewURL: `${history.location.pathname}${history.location.search}`,
                isGridView: false
            })
        } else {
            const firstLevelcompoundNumber = history.location.pathname
                .slice(1)
                .split('/')[1]

            history.push(`/compound/${compoundNumber}`, {
                ...history.location.state,
                firstLevelcompoundNumber: firstLevelcompoundNumber,
                returnToSimilarCompoundsViewURL: `${history.location.pathname}${history.location.search}`,
                isGridView: false
            })
        }
    }

    const partRowClickActions = compoundInfo => {
        if (selectedCompoundStore.isMultiSelectView) {
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
                ['multi-select-row', selectedCompoundStore.isMultiSelectView]
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
                    content = <compoundNumberCell compoundInfo={compoundInfo} />
                }
                return (
                    <Cell
                        key={`${compoundInfo.compoundNumber}-${heading}-cell`}
                        cellIndex={cellIndex}
                    >
                        <div style={{ position: 'relative' }}>
                            {selectedCompoundStore.isMultiSelectView &&
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

export default withRouter(inject('selectedCompoundStore')(observer(CompoundRow)))
