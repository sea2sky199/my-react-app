import React, { Component } from 'react'

import { hasClass } from '../../utilities'

const SliderStops = ({
    values,
    index,
    changed
}) => (
    <div className="slider-stops">
        {values.map((value, i) => (
            <div 
                onClick={() => changed(value, i)}
                key={i}
                id={`slider-stop-${i}-${value}`}
                className={`slider-stop ${hasClass(['active', i <= index])}`}
            />
        ))}
    </div>
)

const SliderTrack = ({
    index,
    length
}) => (
    <div className="slider-track">
        <div className="slider-inner-track" style={{ width: `${(index / (length - 1)) * 100}%` }} />
    </div>
)

export default function Slider({id, name, classNames, values, changed, width}) {
  const [index, setIndex] = React.useState(0);
  const [changed, setChanged] = React.useState(null);
  const [values, setValues] = React.useState(null);
  const [classNames, setClassNames] = React.useState(null);
  const [width, setWidth] = React.useState(null);
  const inputRef = React.useRef(null);

  const rangeChanged = (index) => {
        this.setState({ index })

        changed(values[index])
    };

  const stopChanged = (value, index) => {
        if (index !== index) {
            this.setState({ index })
    
            changed(value)
        }
    };

  return (
            <div 
                className={['stepped-slider', ...classNames].join(' ')}
                style={{width: width}}
                onMouseDown={() => inputRef.current.classList.add('focus')}
                onMouseUp={() => {
                    inputRef.current.focus()
                    inputRef.current.classList.remove('focus')
                }}
            >
                <input
                    type="range"
                    max={values.length - 1}
                    min="0"
                    value={index}
                    onChange={(e) => rangeChanged(parseInt(e.target.value))}
                    ref={inputRef}
                    id={id}
                    name={name}
                />
                <SliderTrack index={index} length={values.length} />
                <SliderStops values={values} index={index} changed={stopChanged} />
            </div>
        );
}
