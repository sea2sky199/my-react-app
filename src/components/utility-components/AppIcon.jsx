import React from 'react'

function renderSvgChildren(nodes) {
    if (!nodes || !nodes.length) return null
    return nodes.map((node, i) => {
        const { name, attribs = {}, children = [] } = node
        return React.createElement(name, { key: i, ...attribs }, renderSvgChildren(children))
    })
}

function AppIcon({ icon, size = 16, style, className, onClick, tabIndex, onKeyDown, name }) {
    if (!icon) return null
    const { viewBox, children } = icon
    return (
        <span
            className={className}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}
            onClick={onClick}
            tabIndex={tabIndex}
            onKeyDown={onKeyDown}
            aria-label={name}
        >
            <svg
                viewBox={viewBox}
                width={size}
                height={size}
                fill="currentColor"
                style={{ display: 'block' }}
            >
                {renderSvgChildren(children)}
            </svg>
        </span>
    )
}

export default AppIcon
