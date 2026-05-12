import React, { Component, Fragment } from 'react'

import 'rheostat/initialize'
import Rheostat from 'rheostat'

import _ from 'lodash'

function RangeFilter({range, activeRange, updateRangeMethod, grouping}) {
  const [range, setRange] = React.useState(max - min);
  const [minRange, setMinRange] = React.useState(min);
  const [maxRange, setMaxRange] = React.useState(max);
  const [minInput, setMinInput] = React.useState(activeRange[0]);
  const [maxInput, setMaxInput] = React.useState(activeRange[1]);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const didActiveRangeUpdate = !_.isEqual(
            activeRange,
            activeRange
        )
        if (didActiveRangeUpdate) {
            let activeRange = activeRange || range
            updateInputValues(activeRange)
        }
  }, [range, activeRange, updateRangeMethod, grouping]);

  inputOnChange = _.debounce((min, max) => {
        let minUpdate = min
        let maxUpdate = max
        let activeRange = activeRange || [
            minRange,
            maxRange
        ]
        if (!min || min > maxInput) {
            minUpdate = activeRange[0]
        }
        if (minUpdate < minRange) {
            minUpdate = minRange
        }

        if (!max || max < minInput) {
            maxUpdate = activeRange[1]
        }
        if (maxUpdate > maxRange) {
            maxUpdate = maxRange
        }

        this.updateInputValues([minUpdate, maxUpdate], true)
    }, 1500)

  const updateInputValues = (range, persistChange = false) => {
        if (persistChange) {
            updateValues(range)
        }
        range = roundRangeToHundreths(range)
        this.setState({ minInput: range[0], maxInput: range[1] })
    };

  const activeRange = activeRange || []

        const values = [
            realValToPercent(
                activeRange.length ? activeRange[0] : minRange
            ),
            realValToPercent(
                activeRange.length ? activeRange[1] : maxRange
            )
        ]

        return (
            <Fragment>
                <div className="range-selection-container">
                    <Rheostat
                        values={values}
                        onChange={({ values }) => {
                            values = values.map(percent =>
                                percentToRealVal(percent)
                            )
                            updateValues(values)
                        }}
                        onValuesUpdated={({ values }) => {
                            values = values.map(percent =>
                                percentToRealVal(percent)
                            )
                            updateInputValues(values, false)
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
