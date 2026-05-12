import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

function HamburgerDropdown({isAdmin, history}) {
  const renderHamburgerDropdownLinks = () => {
        let links = [
            { title: 'Home', path: '/' },
            { title: 'Compounds', path: '/compounds' }
        ]

        if (isAdmin) {
            links.push({ title: 'Manage Users', path: '/admin' })
        }

        return links.map((linkMap, i) => {
            return (
                <div
                    key={i}
                    className="hamburger-dropdown-link pointer"
                    onClick={() => history.push(linkMap.path)}
                >
                    {linkMap.title}
                </div>
            )
        })
    };

  return (
            <div className="hamburger-dropdown h4 letter-spacing">
                {renderHamburgerDropdownLinks()}
            </div>
        );
}

export default withRouter(HamburgerDropdown)
