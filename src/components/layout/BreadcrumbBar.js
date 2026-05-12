import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'

import { Icon } from 'react-icons-kit'
import { ic_keyboard_arrow_right } from 'react-icons-kit/md/ic_keyboard_arrow_right'

const BreadcrumbBar = ({ history }) => {
    const pushBreadcrumbInfo = (breadcrumbsArray, title, path) => {
        breadcrumbsArray.push({ breadcrumb: title, path: path })
    }

    const pushBreadcrumbForCompoundsPath = breadcrumbsArray => {
        const allCompoundsURL =
            history.location.state &&
            history.location.state.returnToAllCompoundsViewURL
                ? history.location.state.returnToAllCompoundsViewURL
                : '/compounds'
        pushBreadcrumbInfo(breadcrumbsArray, 'Compounds', allCompoundsURL)
    }

    const pushBreadcrumbForSingleCompoundPath = (breadcrumbsArray, compoundNumber) => {
        pushBreadcrumbInfo(
            breadcrumbsArray,
            `${compoundNumber}`,
            `/compound/${compoundNumber}`
        )
    }

    const pushBreadcrumbForSimilarCompoundPath = (breadcrumbsArray, compoundNumber) => {
        const similarCompoundsURL =
            history.location.state &&
            history.location.state.returnToSimilarCompoundsViewURL
                ? history.location.state.returnToSimilarCompoundsViewURL
                : `/similar/${compoundNumber}`
        pushBreadcrumbInfo(breadcrumbsArray, 'Similar Compounds', similarCompoundsURL)
    }

    const getBreadcrumbsInfo = () => {
        let breadcrumbs = [{ breadcrumb: 'Home', path: '/' }]
        const pathPieces = history.location.pathname
            .slice(1)
            .split('/')
            .filter(pathPiece => pathPiece !== '')
        if (pathPieces.length) {
            if (pathPieces[0] === 'admin') {
                pushBreadcrumbInfo(breadcrumbs, 'Admin', '/admin')
            } else if (pathPieces[0] === 'help') {
                pushBreadcrumbInfo(breadcrumbs, 'Help Center', '/help')
            } else if (pathPieces[0] === 'compounds') {
                pushBreadcrumbForCompoundsPath(breadcrumbs)
            } else if (pathPieces[0] === 'compound') {
                const isFirstLevelCompoundPresent =
                    !!history.location.state &&
                    history.location.state.firstLevelcompoundNumber
                if (
                    isFirstLevelCompoundPresent &&
                    history.location.state.firstLevelcompoundNumber !==
                        pathPieces[1]
                ) {
                    pushBreadcrumbForCompoundsPath(breadcrumbs)
                    pushBreadcrumbForSingleCompoundPath(
                        breadcrumbs,
                        history.location.state.firstLevelcompoundNumber
                    )
                    pushBreadcrumbForSimilarCompoundPath(
                        breadcrumbs,
                        history.location.state.firstLevelcompoundNumber
                    )
                    pushBreadcrumbForSingleCompoundPath(breadcrumbs, pathPieces[1])
                } else {
                    pushBreadcrumbForCompoundsPath(breadcrumbs)
                    pushBreadcrumbForSingleCompoundPath(breadcrumbs, pathPieces[1])
                }
            } else if (pathPieces[0] === 'similar') {
                pushBreadcrumbForCompoundsPath(breadcrumbs)
                pushBreadcrumbForSingleCompoundPath(breadcrumbs, pathPieces[1])
                pushBreadcrumbForSimilarCompoundPath(breadcrumbs, pathPieces[1])
            }
        }

        return breadcrumbs
    }

    const renderBreadcrumbs = () => {
        const breadcrumbInfo = getBreadcrumbsInfo()
        return breadcrumbInfo.map((breadcrumbObj, i) => {
            if (i === breadcrumbInfo.length - 1) {
                return (
                    <Fragment key={i}>
                        <div className="semi-bold">
                            {breadcrumbObj.breadcrumb}
                        </div>
                    </Fragment>
                )
            } else {
                return (
                    <Fragment key={i}>
                        <div
                            className="breadcrumb-link pointer"
                            onClick={() =>
                                history.push(breadcrumbObj.path, {
                                    ...history.location.state
                                })
                            }
                        >
                            {breadcrumbObj.breadcrumb}
                        </div>
                        <Icon
                            icon={ic_keyboard_arrow_right}
                            size={12}
                            style={{ marginTop: '-1px', padding: '0 0.25rem' }}
                        />
                    </Fragment>
                )
            }
        })
    }

    return (
        <div className="breadcrumb-bar flex align-center h5-5 letter-spacing-large semi-thin">
            {renderBreadcrumbs()}
        </div>
    )
}

export default withRouter(BreadcrumbBar)
