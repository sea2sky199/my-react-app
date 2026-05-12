import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './help-center.css'

import { ClickableDiv } from '..'
import HelpCenterTextBody from './HelpCenterTextBody'
import {
    version,
    ourVision,
    faq,
    releaseNotes,
    introductionHowTo,
    toolDescription,
    featureDefinition,
    siteMetrics,
    exportControl,
    privacyNotice,
    contactUs,
    siteName,
    financialAccessRequirements,
    trackPageView
} from '../../utilities'

function HelpCenter({compoundsStore, userInfoStore}) {
  const navigate = useNavigate();
  const location = useLocation();

  const helpCenterPages = [
        {
            heading: 'OUR VISION',
            helpPageObj: ourVision,
            route: 'vision'
        },
        {
            heading: 'FAQ',
            helpPageObj: faq(compoundsStore.summary.totalcompounds.count),
            route: 'faq'
        },
        {
            heading: `WHAT'S NEW (${version})`,
            helpPageObj: releaseNotes,
            route: 'release-notes'
        },
        {
            heading: 'HOW-TO FOR BEGINNERS',
            helpPageObj: introductionHowTo,
            route: 'how-to'
        },
        {
            heading: 'TOOL DESCRIPTION',
            helpPageObj: toolDescription,
            route: 'description'
        },
        {
            heading: 'FEATURE DEFINITION',
            helpPageObj: featureDefinition,
            route: 'feature-definition'
        },
        {
            heading: 'METRICS & VISUALS',
            helpPageObj: siteMetrics(
                compoundsStore.summary.totalcompounds.count
            ),
            route: 'metrics'
        },
        {
            heading: 'FINANCIAL DATA ACCESS',
            helpPageObj: financialAccessRequirements(
                userInfoStore.userInfo
            ),
            route: 'financial-access'
        },
        {
            heading: 'EXPORT CONTROL',
            helpPageObj: exportControl,
            route: 'export-control'
        },
        {
            heading: 'PRIVACY NOTICE',
            helpPageObj: privacyNotice,
            route: 'privacy-notice'
        },
        {
            heading: 'CONTACT US',
            helpPageObj: contactUs,
            route: 'contact'
        }
    ]

  const [currentHelpPage, setCurrentHelpPage] = React.useState(helpCenterPages[0]);

  const routeToPage = (route) => {
        navigate(`/help?title=${route}`)
    };

  const getCurrentPage = () => {
        const currentQueryString = location.search
        return helpCenterPages.find(
            page => `?title=${page.route}` === currentQueryString
        )
    };

  const setCurrentPage = () => {
        const currentPage = getCurrentPage()
        if (!currentPage) {
            routeToPage(helpCenterPages[0].route)
        } else if (currentPage !== currentHelpPage) {
            setCurrentHelpPage(currentPage)
        }
    };

  React.useEffect(() => {
    setCurrentPage()
  }, []);

  React.useEffect(() => {
    setCurrentPage()
  }, [location.search]);

  const renderHelpCenterList = () => {
        return helpCenterPages.map(page => {
            const classNames = ['help-center-list-item']
            if (page === currentHelpPage) {
                classNames.push('help-center-list-item-active')
            }
            return (
                <ClickableDiv
                    classNameArr={classNames}
                    key={page.heading}
                    clickAction={() => routeToPage(page.route)}
                >
                    {page.heading}
                </ClickableDiv>
            )
        })
    };

  return (
            <div className="help-center-container flex-column padding-top-nav-breadcrumb full-page-height">
                <div className="help-center-header h1 semi-bold letter-spacing">
                    {`${siteName} Help Center`}
                </div>
                <div
                    className="flex"
                    style={{
                        paddingTop: '2rem',
                        overflow: 'hidden'
                    }}
                >
                    <div
                        className="flex-column h5 semi-thin letter-spacing"
                        style={{
                            height: '100%',
                            minWidth: '15rem',
                            whiteSpace: 'nowrap',
                            overflowY: 'auto'
                        }}
                    >
                        {renderHelpCenterList()}
                    </div>
                    <div
                        style={{
                            flexGrow: '1',
                            padding: '0 4rem 0 3rem',
                            height: '100%',
                            overflowY: 'auto'
                        }}
                    >
                        <HelpCenterTextBody
                            helpPageObj={currentHelpPage.helpPageObj}
                        />
                    </div>
                </div>
            </div>
        );
}

export default HelpCenter
