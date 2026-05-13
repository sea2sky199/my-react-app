import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import apiService from '../../data/ApiService'

import IcicleChart from '../data-visualizations/IcicleChart'
import ClickableDiv from '../utility-components/ClickableDiv'
import { siteName, trackPageView } from '../../utilities'
import HomeSearch from './HomeSearch'
import './home.css'

function HomePage({userInfoStore}) {
  const navigate = useNavigate();
  const location = useLocation();

  const name = userInfoStore && userInfoStore.userInfo ? userInfoStore.userInfo.name : ''

  const [data, setData] = React.useState({});
  const [isSearchView, setIsSearchView] = React.useState(true);
  const [loading, setLoading] = React.useState(true);

  const reroute = (path) => navigate(path);

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

  const buildDataHeirarchy = (res) => {
        addFilterNavigationArray(res)
        setData(res)
        setLoading(false)
    };

  const indexOfName = (array, name) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i].name === name) {
                return i
            }
        }
        return -1
    };

  React.useEffect(() => {
        trackPageView(location.pathname, 'Compound Match - Home')
        apiService.get('compoundsExplore').then(res => {
            buildDataHeirarchy(res)
        })
  }, []);

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

export default HomePage
