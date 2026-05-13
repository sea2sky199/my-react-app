import React from 'react'
import { useNavigate } from 'react-router-dom'

function HamburgerDropdown({isAdmin}) {
  const navigate = useNavigate();

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
                    onClick={() => navigate(linkMap.path)}
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

export default HamburgerDropdown
