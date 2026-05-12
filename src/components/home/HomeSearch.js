import React, { PureComponent } from 'react'

import { ClickableDiv } from '..'
import { handleKeyDown } from '../../utilities'

import { Icon } from 'react-icons-kit'
import { ic_search } from 'react-icons-kit/md/ic_search'
import { ic_close } from 'react-icons-kit/md/ic_close'
import './home.css'

class HomeSearch extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            searchInput: ''
        }
    }

    getcompoundNumberRerouteURL = () => {
        return `/compounds?search=compoundNumber,${encodeURIComponent(
            this.state.searchInput.toUpperCase()
        )}`
    }

    render() {
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
                        value={this.state.searchInput}
                        onChange={e =>
                            this.setState({
                                searchInput: e.target.value
                            })
                        }
                        onKeyDown={e => {
                            if (!!this.state.searchInput.length) {
                                handleKeyDown(e, () =>
                                    this.props.reroute(
                                        this.getcompoundNumberRerouteURL()
                                    )
                                )
                            }
                        }}
                    />
                    <Icon
                        className={
                            !!this.state.searchInput.length
                                ? 'fadeOut'
                                : 'fadeIn'
                        }
                        style={{ marginLeft: '-2.5rem' }}
                        icon={ic_search}
                        size="26"
                    />
                    <Icon
                        className={
                            !!this.state.searchInput.length
                                ? 'pointer fadeIn'
                                : 'fadeOut'
                        }
                        style={{ marginLeft: '-1.5rem' }}
                        icon={ic_close}
                        size="26"
                        onClick={() => this.setState({ searchInput: '' })}
                    />
                    {!!this.state.searchInput.length && (
                        <div className="home-search-results-container h3">
                            <ClickableDiv
                                classNameArr={['home-search-result']}
                                clickAction={() =>
                                    this.props.reroute(
                                        this.getcompoundNumberRerouteURL()
                                    )
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
}

export default HomeSearch
