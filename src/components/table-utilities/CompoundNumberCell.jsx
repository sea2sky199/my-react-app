import React, { Fragment } from 'react'

import CompoundImage from '../image-components/CompoundImage'

const compoundNumberCell = ({ compoundInfo }) => {
    return (
        <Fragment>
            <div className="flex align-center">
                <div
                    style={{
                        position: 'relative',
                        zIndex: '0'
                    }}
                >
                    {!!compoundInfo.unreleasedStatus && (
                        <div className="compounds-table-unreleased-overlay h8-5">
                            <i>UNRELEASED</i>
                        </div>
                    )}
                    <CompoundImage
                        compoundNumberClean={compoundInfo['compoundNumberClean']}
                        className={'part-table-image zoom-hover-image'}
                    />
                </div>
                <div className="nowrap">
                    <div>{compoundInfo['compoundNumberClean'] || '-'}</div>
                    {!!compoundInfo['compoundNumberVersion'] && (
                        <div className="h8 bold" style={{ color: '#999999' }}>
                            <i>{`REV ${compoundInfo['compoundNumberVersion']}`}</i>
                        </div>
                    )}
                </div>
            </div>
        </Fragment>
    )
}

export default compoundNumberCell
