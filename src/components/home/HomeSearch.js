import React from 'react'

import { ClickableDiv } from '..'
import { handleKeyDown } from '../../utilities'

import { Icon } from 'react-icons-kit'
import { ic_search } from 'react-icons-kit/md/ic_search'
import { ic_close } from 'react-icons-kit/md/ic_close'
import './home.css'

function HomeSearch({reroute}) {
  const [searchInput, setSearchInput] = React.useState('');

  const getcompoundNumberRerouteURL = () => {
        return `/compounds?search=compoundNumber,${encodeURIComponent(
            searchInput.toUpperCase()
        )}`
    }

  return (
            <div className="home-search-container flex-column align-center letter-spacing">
                <div className="h00 semi-bold" style={{ paddingTop: '16vh' }}>
                    Looking for a compound?
                </div>
                <div
                    className="h5"
                    style={{ color: '#999999', padding: '0.5rem 0' }}
                >
                    Search for a single part, or search multiple compounds seperated
                    by a comma...
                </div>
                <div
                    style={{
                        width: '70%',
                        padding: '2rem 0'
                    }}
                >
                    <input
                        className="home-search-input h3"
                        type={'search'}
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
                    <Icon
                        className={
                            !!searchInput.length
                                ? 'fadeOut'
                                : 'fadeIn'
                        }
                        style={{ marginLeft: '-2.5rem' }}
                        icon={ic_search}
                        size="26"
                    />
                    <Icon
                        className={
                            !!searchInput.length
                                ? 'pointer fadeIn'
                                : 'fadeOut'
                        }
                        style={{ marginLeft: '-1.5rem' }}
                        icon={ic_close}
                        size="26"
                        onClick={() => setSearchInput('')}
                    />
                    {!!searchInput.length && (
                        <div className="home-search-results-container h3">
                            <ClickableDiv
                                classNameArr={['home-search-result']}
                                clickAction={() =>
                                    reroute(getcompoundNumberRerouteURL())
                                }
                            >
                                View All Results
                            </ClickableDiv>
                        </div>
                    )}
                </div>
            </div>
        )
}

export default HomeSearch
