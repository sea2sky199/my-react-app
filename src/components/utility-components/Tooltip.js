import React, { Fragment, useState, useRef } from 'react'
import './utilities.css'

export default ({
    data,
    children,
    style = {},
    forcePositionDown = false,
    textColor = 'black',
    backgroundColor = '#e5e5e5'
}) => {
    const [mousePos, setMousePos] = useState({ x: null, y: null })
    const [isVisible, setIsVisible] = useState(false)
    const [isBottom, setIsBottom] = useState(forcePositionDown)
    const [bubbleOffset, setBubbleOffset] = useState({ transform: 'translateX(0)' })
    const [hideTimer, setHideTimer] = useState(null)
    const toolTipRef = useRef(null)

    function onMouseEnter(e) {
        const targetRect = e.target.getBoundingClientRect()
        const toolTipRect = toolTipRef.current.getBoundingClientRect()

        const isOffscreenY = forcePositionDown ?
            true :
            targetRect.top - toolTipRect.height < 0

        const x = (targetRect.width / 2) + targetRect.left - (toolTipRect.width / 2)
        const y = isOffscreenY ?
            targetRect.bottom + 2 :
            targetRect.top - toolTipRect.height - 2

        let bubbleOffsetDelta = x < 5 ? (x * -1) + 5 : 0
            
        bubbleOffsetDelta = (x + toolTipRect.width + 5) > window.innerWidth ?
            window.innerWidth - (x + toolTipRect.width + 5):
            bubbleOffsetDelta

        setBubbleOffset({ transform: `translateX(${bubbleOffsetDelta}px)` })
        setMousePos({ x, y })
        setIsBottom(isOffscreenY)

        if (data) {
            setIsVisible(true)
        }
    }

    function onMouseLeave(e) {
        setIsVisible(false)
    }

    function onMouseMove() {
        if (hideTimer !== null) {
            clearTimeout(hideTimer)
        }

        setHideTimer(setTimeout(() => setIsVisible(false), 2000))
    }

    let toolTipStyles = {
        ...style,
        ...findViewportOrigin(),
        zIndex: '3',
        display: 'flex',
        flexDirection: isBottom ? 'column-reverse' : 'column',
        alignItems: 'center',
        position: 'fixed',
        transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
        visibility: isVisible ? 'visible' : 'hidden',
        filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.5)'
    }

    let textStyles = {
        ...bubbleOffset,
        backgroundColor,
        color: textColor,
        padding: '8px 21px',
        opacity: 1,
        fontSize: '13px',
        borderRadius: '3px',
        maxWidth: '450px',
        wordBreak: 'keep-all',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
    }

    function findViewportOrigin() {
        return { left: 0, top: 0 }
    }

    let svgStyle = isBottom ? {} : { transform: 'rotate(180deg)' }

    return (
        <Fragment>
            <div id="Tooltip" ref={toolTipRef} style={toolTipStyles}>
                <div style={textStyles}>{data}</div>
                <svg
                    width={20}
                    height={10}
                    viewBox={'0 0 20 10'}
                    style={{ ...svgStyle, opacity: 1 }}
                >
                    <defs>
                        <filter id="shadow">
                            <feDropShadow dx="0" dy="1" stdDeviation="1" />
                        </filter>
                    </defs>
                    <polygon
                        points={'0,10 20,10 10,0'}
                        stroke={backgroundColor}
                        fill={backgroundColor}
                        className="drop-shadow"
                    />
                </svg>
            </div>
            <div 
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
                style={{display: 'inline-block'}}
            >
                { children }
            </div>
        </Fragment>
    )
}
