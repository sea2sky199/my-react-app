import React from 'react'

const HelpCenterTextBody = ({ helpPageObj }) => {
    if (!helpPageObj) {
        return 'Page Not Found'
    }
    return (
        <div className="flex-column letter-spacing">
            <div className="h1 semi-bold" style={{ paddingBottom: '1rem' }}>
                {helpPageObj.heading}
            </div>
            <div
                className="help-center-body h5"
                style={{ color: '#6a6a6a', paddingBottom: '2rem' }}
            >
                {helpPageObj.body}
            </div>
        </div>
    )
}

export default HelpCenterTextBody
