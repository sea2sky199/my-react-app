import React from 'react'
import './home.css'

const formatTitle = title => {
    if (!title.toLowerCase().includes('compounds')) {
        title = `${title}Compounds`
    }
    //sql databases do not do camel case
    if (title === 'totalcompounds') {
        title = 'totalCompounds'
    }

    //convert camel case to human case
    return title.replace(/([A-Z])/g, ' $1').replace(/^./, function(str) {
        return str.toUpperCase()
    })
}

const RequestAccessSidebar = ({ data }) => {
    const renderCompoundDataList = data => {
        if (!data) {
            return null
        }
        let titles = [
            'totalcompounds',
            ...Object.keys(data).filter(accessor => accessor !== 'totalcompounds')
        ]

        return titles.map((title, i) => {
            return (
                <div key={i} className="sidebar-list-item flex align-center">
                    <div className="sidebar-text-container">
                        <div className="sidebar-list-title h5 bold">
                            {formatTitle(title).toUpperCase()}
                        </div>
                        <div className="sidebar-list-description h1-5 thin">
                            {data[title] ? data[title].count : ''}
                        </div>
                    </div>
                </div>
            )
        })
    }

    return (
        <div className="request-access-sidebar-container flex-column">
            {renderCompoundDataList(data)}
        </div>
    )
}
export default RequestAccessSidebar
