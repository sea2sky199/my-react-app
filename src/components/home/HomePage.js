import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router-dom'

import apiService from '../../data/ApiService'

import { IcicleChart, ClickableDiv } from '..'
import { siteName, trackPageView } from '../../utilities'
import HomeSearch from './HomeSearch'
import './home.css'

function HomePage({userInfoStore, location, history}) {
  const [name, setName] = React.useState(name);
  const [data, setData] = React.useState({});
  const [isSearchView, setIsSearchView] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    let res;
    // matomo tracking
        let currentUrl = location.pathname
        trackPageView(currentUrl, 'Compound Match - Home')

        apiService.get('compoundsExplore').then(res => {
            buildDataHeirarchy(res)
        })
  }, []);

  const addFilterNavigationArray = (data, filterParameterArray = []) => {
        if (data.grouping) {
            filterParameterArray = [
                ...filterParameterArray,
                `filter=${data.grouping},${data.name}`
            ]
        }
        data.filterParameterArray = filterParameterArray
        data.children.forEach(child =>
            addFilterNavigationArray(child, filterParameterArray)
        )
    };

  const indexOfName = (array, name) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i].name === name) {
                return i
            }
        }
        return -1
    };

  const renderHomeTab = (title, onClickCallback, isActive) => {
        const classNamesArr = ['home-tab', 'letter-spacing']
        if (isActive) {
            classNamesArr.push('home-tab-active')
        }

        return (
            <ClickableDiv
                classNameArr={classNamesArr}
                clickAction={onClickCallback}
            >
                {title}
            </ClickableDiv>
        )
    };

  return (
            <div className="home-container flex-column padding-top-nav full-page-height letter-spacing">
                <div className="home-welcome-banner h1">{`Welcome, ${name}.`}</div>
                <div className="home-description-banner h4 semi-thin">
                    {`${siteName} is a 3D similarity search application that clusters and
                    categorizes 3D compounds by geometry, providing analysis
                    capability for similarity search. `}
                    <i>For best experience, use Mozilla Firefox.</i>
                </div>
                <div className="home-tab-container flex h6 semi-bold letter-spacing-none">
                    {renderHomeTab(
                        'SEARCH COMPOUNDS',
                        () => setIsSearchView(true),
                        isSearchView
                    )}
                    {renderHomeTab(
                        'EXPLORE COMPOUNDS',
                        () => setIsSearchView(false),
                        !isSearchView
                    )}
                </div>
                {isSearchView ? (
                    <HomeSearch reroute={reroute} />
                ) : (
                    <div className="home-icicle-chart-container flex letter-spacing-large">
                        {!loading && (
                            <IcicleChart
                                data={data}
                                reroute={reroute}
                            />
                        )}
                    </div>
                )}
            </div>
        );
}

export default withRouter(inject('userInfoStore')(observer(HomePage)))
