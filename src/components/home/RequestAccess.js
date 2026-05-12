import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import './home.css'
import { Information } from '..'
import {
    contactEmail,
    encodedNewLine,
    siteName,
    financialAccessRequirements,
    trackPageView
} from '../../utilities'

import logo from '../../images/compoundMatchLogo.svg'

import RequestAccessSidebar from './RequestAccessSidebar'

function RequestAccess({userInfoStore, compoundsStore, location}) {
  const [name, setName] = React.useState(name);
  const [summary, setSummary] = React.useState(summary);
  React.useEffect(() => {
    // matomo tracking
        let currentUrl = location.pathname
        trackPageView(currentUrl, 'Compound Match - Request Access')
  }, []);

  const requestAccessLink = () => {
        const chemdw =
            userInfoStore && userInfoStore.userInfo
                ? userInfoStore.userInfo.user_id
                : '<BemsId>'
        const subject = `Requesting ${siteName} Access`
        const body = `Dear Administrator,
        ${encodedNewLine}${encodedNewLine}I am requesting access for BEMSID: ${chemdw}
        ${encodedNewLine}${encodedNewLine}Thank You,${encodedNewLine}${name}`
        return `mailto:${contactEmail}?subject=${subject.replace(
            ' ',
            '%20'
        )}&body=${body.replace(' ', '%20')}`
    };

  return (
            <Fragment>
                <RequestAccessSidebar data={summary} />
                <div className="request-access-container full-page-height">
                    <div className="request-access-logo-container">
                        <img
                            className="img-autosize"
                            src={logo}
                            alt={siteName}
                        />
                    </div>
                    <div className="request-access-description h4 semi-thin letter-spacing">
                        {`Hello `}
                        <b>{`${name}`}</b>
                        {`. ${siteName} is a 3D similarity search application that clusters and categorizes 3D compounds by geometry, providing analysis capability for engineering design, supplier management and re-use and commonality efforts.`}
                        <Information
                            header="Financial Access"
                            eventName="showFinancialAccessRequirements"
                        >
                            <div className="h6 access-requirements-container">
                                {
                                    financialAccessRequirements(
                                        userInfoStore.userInfo
                                    ).body
                                }
                            </div>
                        </Information>
                    </div>
                    <a
                        className="request-access-button h4 pointer"
                        href={requestAccessLink()}
                    >
                        Request Access
                    </a>
                </div>
            </Fragment>
        );
}

export default withRouter(
    inject('userInfoStore', 'compoundsStore')(observer(RequestAccess))
)
