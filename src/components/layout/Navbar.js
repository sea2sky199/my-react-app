import React, { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router-dom'

import _ from 'lodash'
import { Icon } from 'react-icons-kit'
import { ic_search } from 'react-icons-kit/md/ic_search'
import { ic_close } from 'react-icons-kit/md/ic_close'
import './layout.css'

import { ClickableDiv } from '..'
import { handleKeyDown, siteName } from '../../utilities'
import NavLinks from './NavLinks'
import HamburgerDropdown from './HamburgerDropdown'
import UserDropdown from './UserDropdown'

import logo from '../../images/compoundMatchLogo.svg'

function Navbar({history, userInfoStore}) {
  const [searchBarOpen, setSearchBarOpen] = React.useState(null);
  const [searchInput, setSearchInput] = React.useState(null);
  const [hamburgerDropdown, setHamburgerDropdown] = React.useState(null);
  const prevSearchBarOpenRef = React.useRef();
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClick, false)
    
    return () => {
      document.removeEventListener('mousedown', handleClick, false)
    };
  }, []);
  React.useEffect(() => {
    if (!prevSearchBarOpenRef.current && searchBarOpen) {
            document.getElementsByClassName('nav-search-input')[0].focus()
        }
    prevSearchBarOpenRef.current = searchBarOpen;
  }, [history, userInfoStore, searchBarOpen]);

  toggleSearchBar = _.debounce(() => {
        this.setState({ searchBarOpen: !searchBarOpen })
    }, 500)

  const inputXAction = () => {
        if (searchBarOpen) {
            if (searchInput.length) {
                setSearchInput('')
            } else {
                toggleSearchBar()
            }
        }
    };

  const getcompoundNumberRerouteURL = () => {
        return `/compounds?search=compoundNumber,${encodeURIComponent(
            searchInput.toUpperCase()
        )}`
    };

  const userInfo = userInfoStore
            ? userInfoStore.userInfo
            : {}

        return (
            <div className="navbar flex space-between">
                <div className="flex">
                    <ClickableDiv
                        classNameArr={[
                            'nav-logo-container',
                            'flex',
                            'align-center'
                        ]}
                        clickAction={() => reroute('/')}
                    >
                        <img
                            className="nav-logo img-autosize"
                            src={logo}
                            alt={siteName}
                            style={{ maxHeight: '10vh', minHeight: '1px' }}
                        />
                    </ClickableDiv>
                    <NavLinks
                        navLinkMap={{ Home: '/', Compounds: '/compounds' }}
                        reroute={reroute}
                        currentPathname={
                            history
                                ? history.location.pathname
                                : ''
                        }
                    />
                </div>
                <button
                    className="hamburger h3"
                    onClick={() =>
                        setHamburgerDropdown(!hamburgerDropdown)
                    }
                >
                    <span>&#9776;</span>
                </button>
                {hamburgerDropdown && (
                    <HamburgerDropdown isAdmin={userInfo.role === 'ADMIN'} />
                )}
                <div className="nav-full-length flex align-center nowrap">
                    <div
                        className="nav-search-container flex align-center"
                        ref={node => (searchInput = node)}
                    >
                        <Fragment>
                            <input
                                className={
                                    searchBarOpen
                                        ? 'nav-search-input expandIn'
                                        : 'nav-search-input shrinkOut'
                                }
                                type={'search'}
                                placeholder={'Insert Compound Number(s)...'}
                                value={searchInput}
                                onChange={e =>
                                    setSearchInput(e.target.value)
                                }
                                onKeyDown={e => {
                                    if (!!searchInput.length) {
                                        handleKeyDown(e, () =>
                                            reroute(
                                                getcompoundNumberRerouteURL()
                                            )
                                        )
                                    }
                                }}
                            />
                            {searchBarOpen &&
                                !!searchInput.length && (
                                    <div className="nav-search-results-container h5">
                                        <ClickableDiv
                                            classNameArr={[
                                                'nav-search-result',
                                                'nav-search-button'
                                            ]}
                                            clickAction={() =>
                                                reroute(
                                                    getcompoundNumberRerouteURL()
                                                )
                                            }
                                        >
                                            View All Results
                                        </ClickableDiv>
                                    </div>
                                )}
                        </Fragment>
                        <Icon
                            id="nav-search-icon"
                            className={
                                searchBarOpen
                                    ? 'search-icon nav-clickable pointer fadeOut'
                                    : 'search-icon nav-clickable pointer fadeIn'
                            }
                            icon={ic_search}
                            size="20"
                            onClick={toggleSearchBar}
                        />
                        <Icon
                            className={
                                !searchBarOpen
                                    ? 'search-icon nav-clickable pointer fadeOut'
                                    : 'search-icon nav-clickable pointer fadeIn'
                            }
                            style={{ marginBottom: '1px', color: '#ffffff' }}
                            icon={ic_close}
                            size="16"
                            onClick={inputXAction}
                        />
                    </div>
                    <UserDropdown userInfo={userInfo} reroute={reroute} />
                </div>
            </div>
        );
}

export default withRouter(inject('userInfoStore')(observer(Navbar)))
