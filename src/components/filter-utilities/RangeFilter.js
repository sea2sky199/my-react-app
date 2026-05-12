import React, { Fragment } from 'react'

import 'rheostat/initialize'
import Rheostat from 'rheostat'

import _ from 'lodash'

function RangeFilter({range, activeRange, updateRangeMethod, grouping}) {
  const { min = 0, max = 100 } = range || {}

  const [minRange] = React.useState(min);
  const [maxRange] = React.useState(max);
  const [minInput, setMinInput] = React.useState(activeRange ? activeRange[0] : min);
  const [maxInput, setMaxInput] = React.useState(activeRange ? activeRange[1] : max);

  const roundRangeToHundreths = (rangeArr) => {
        return rangeArr.map(val => Math.round(val * 100) / 100)
    };

  const realValToPercent = (val) => {
        if (maxRange === minRange) return 0
        return ((val - minRange) / (maxRange - minRange)) * 100
    };

  const percentToRealVal = (percent) => {
        return minRange + (percent / 100) * (maxRange - minRange)
    };

  const updateValues = (rangeArr) => {
        updateRangeMethod(grouping, rangeArr)
    };

  const updateInputValues = (rangeArr, persistChange = false) => {
        if (persistChange) {
            updateValues(rangeArr)
        }
        const rounded = roundRangeToHundreths(rangeArr)
        setMinInput(rounded[0])
        setMaxInput(rounded[1])
    };

  React.useEffect(() => {
        const rangeToUse = activeRange || [minRange, maxRange]
        updateInputValues(rangeToUse)
  }, [activeRange]);

  const inputOnChange = _.debounce((minVal, maxVal) => {
        let minUpdate = minVal
        let maxUpdate = maxVal
        const currentRange = activeRange || [minRange, maxRange]
        if (!minVal || minVal > maxInput) {
            minUpdate = currentRange[0]
        }
        if (minUpdate < minRange) {
            minUpdate = minRange
        }
        if (!maxVal || maxVal < minInput) {
            maxUpdate = currentRange[1]
        }
        if (maxUpdate > maxRange) {
            maxUpdate = maxRange
        }
        updateInputValues([minUpdate, maxUpdate], true)
    }, 1500)

  const currentActiveRange = activeRange || []

        const values = [
            realValToPercent(
                currentActiveRange.length ? currentActiveRange[0] : minRange
            ),
            realValToPercent(
                currentActiveRange.length ? currentActiveRange[1] : maxRange
            )
        ]

        return (
            <Fragment>
                <div className="range-selection-container">
                    <Rheostat
                        values={values}
                        onChange={({ values: rheostatValues }) => {
                            const realValues = rheostatValues.map(percent =>
                                percentToRealVal(percent)
                            )
                            updateValues(realValues)
                        }}
                        onValuesUpdated={({ values: rheostatValues }) => {
                            const realValues = rheostatValues.map(percent =>
                                percentToRealVal(percent)
                            )
                            updateInputValues(realValues, false)
                        }}
                    />
                </div>
                <div className="range-selection-input-container flex space-between">
                    <input
                        className="range-selection-input"
                        type="number"
                        value={minInput}
                        min={minRange}
                        max={maxInput}
                        step={0.01}
                        onChange={({ target: { value } }) => {
                            setMinInput(value)
                            inputOnChange(value, null)
                        }}
                    />
                    <input
                        className="range-selection-input"
                        type="number"
                        value={maxInput}
                        min={minInput}
                        max={maxRange}
                        step={0.01}
                        onChange={({ target: { value } }) => {
                            setMaxInput(value)
                            inputOnChange(null, value)
                        }}
                    />
                </div>
            </Fragment>
        );
}

export default RangeFilter
