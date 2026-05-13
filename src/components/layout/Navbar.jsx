import React, { Fragment } from 'react'
import AppIcon from '../utility-components/AppIcon'
import { useNavigate, useLocation } from 'react-router-dom'

import _ from 'lodash'
import { ic_search } from 'react-icons-kit/md/ic_search'
import { ic_close } from 'react-icons-kit/md/ic_close'
import './layout.css'

import ClickableDiv from '../utility-components/ClickableDiv'
import { handleKeyDown, siteName } from '../../utilities'
import NavLinks from './NavLinks'
import HamburgerDropdown from './HamburgerDropdown'
import UserDropdown from './UserDropdown'

import logo from '../../images/compoundMatchLogo.svg'

function Navbar({userInfoStore}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchBarOpen, setSearchBarOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState('');
  const [hamburgerDropdown, setHamburgerDropdown] = React.useState(false);

  const searchContainerRef = React.useRef(null);
  const hamburgerRef = React.useRef(null);
  const prevSearchBarOpenRef = React.useRef();

  const reroute = (path) => navigate(path);

  const handleClick = React.useCallback((e) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
            setSearchBarOpen(false);
        }
        if (hamburgerRef.current && !hamburgerRef.current.contains(e.target)) {
            setHamburgerDropdown(false);
        }
    }, []);

  React.useEffect(() => {
        document.addEventListener('mousedown', handleClick, false)
        return () => {
            document.removeEventListener('mousedown', handleClick, false)
        };
    }, [handleClick]);

  React.useEffect(() => {
        if (!prevSearchBarOpenRef.current && searchBarOpen) {
            document.getElementsByClassName('nav-search-input')[0].focus()
        }
        prevSearchBarOpenRef.current = searchBarOpen;
    }, [searchBarOpen]);

  const toggleSearchBar = _.debounce(() => {
        setSearchBarOpen(prev => !prev)
    }, 500);

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
                    currentPathname={location.pathname}
                />
            </div>
            <button
                ref={hamburgerRef}
                className="hamburger h3"
                onClick={() => setHamburgerDropdown(prev => !prev)}
            >
                <span>&#9776;</span>
            </button>
            {hamburgerDropdown && (
                <HamburgerDropdown isAdmin={userInfo.role === 'ADMIN'} />
            )}
            <div className="nav-full-length flex align-center nowrap">
                <div
                    className="nav-search-container flex align-center"
                    ref={searchContainerRef}
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
                            onChange={e => setSearchInput(e.target.value)}
                            onKeyDown={e => {
                                if (!!searchInput.length) {
                                    handleKeyDown(e, () =>
                                        reroute(getcompoundNumberRerouteURL())
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
                                            reroute(getcompoundNumberRerouteURL())
                                        }
                                    >
                                        View All Results
                                    </ClickableDiv>
                                </div>
                            )}
                    </Fragment>
                    <AppIcon
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
                    <AppIcon
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

export default Navbar
