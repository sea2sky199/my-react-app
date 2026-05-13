import React from 'react'

import ClickableDiv from '../utility-components/ClickableDiv'

const NavLinks = ({ navLinkMap, reroute, currentPathname }) => {
    return (
        <div className="nav-full-length flex h4 letter-spacing">
            {Object.keys(navLinkMap).map(linkHeading => {
                const url = navLinkMap[linkHeading]
                const classNameArr = [
                    'nav-link-title',
                    'flex-column',
                    'justify-center',
                    'nav-clickable'
                ]
                if (currentPathname === url) {
                    classNameArr.push('nav-link-title-active')
                }
                return (
                    <div
                        className="nav-links flex align-center"
                        key={linkHeading}
                    >
                        <ClickableDiv
                            key={linkHeading}
                            classNameArr={classNameArr}
                            clickAction={() => reroute(url)}
                        >
                            {linkHeading}
                        </ClickableDiv>
                    </div>
                )
            })}
        </div>
    )
}

export default NavLinks
