import React, { Fragment } from 'react'

export const versionReleaseNotes = [
    {
        version: 'V1.0.0',
        notes: [
            `Compound Detail pages now have Compound Notes with expanded details`,
            <Fragment>
                Added informative tips regarding:
                <ul style={{ paddingTop: '0.5rem' }}>
                    <li>
                        Opportunity Exploration visualization (Explore Features)
                    </li>
                    <li>Unique features visualization (Compare Compounds)</li>
                    <li>How to get Financial Permission access</li>
                    <li>Compound Number search fields</li>
                </ul>
            </Fragment>,
        ],
    },
    {
        version: 'V0.20.0',
        notes: [
            `Added dialog for requesting a compound be added to the CompoundMatch
        library, including a way to upload an unreleased compound to be
        evaluated and added`,
            `Added Unique Features visualization to Compare Compound to
        Library (Detailed Compound View) and Compare Compound to Similar
        Results (Similar Compound View)`,
        ],
    },
    {
        version: 'V0.19.0',
        notes: [
            `Added information tips for Size Codes and Quantity of
        Results`,
            `Added Complexity Score attribute for compounds`,
            `Column order and visible columns set by the user will now be
        retained after closing and reopening CompoundMatch`,
            `Leave Feedback now uses a form to gather input`,
            `Compound images will no longer be distorted to fit in the
        available space`,
            `For Administration Users: Added the ability to send an email
        to all users`,
        ],
    },
    {
        version: 'V0.18.0',
        notes: [
            `Similarity results are now always ranked sequentially,
        regardless of applied filters`,
            `Expanded the initial size filtering for similarity results
        to show more size groups`,
            `Compound size filters now combine size code and size sub code
        into a single filter`,
            `Enabled ability to share links directly to Help Center pages`,
            `Added Explore Features/Opportunity Exploration vizualization
        to All/Similar Compounds Views`,
        ],
    },
    {
        version: 'V0.17.0',
        notes: [
            `Renamed the application to CompoundMatch`,
            `Added the capability to change the order of columns
        displayed in table views`,
            `Updated the way to control the number of similar results on
        the similar results display`,
            `Added the capability to multi-select compounds, export selected
        compounds to a csv file, and do a side by side comparison for
        2-3 selected compounds`,
        ],
    },
    {
        version: 'V0.16.0',
        notes: [
            `Updated the Supplier Name filtering on compounds table and compounds
        grid views`,
            `Added compound size filtering to compound similarity results`,
            `Now displaying compound notes on the Detailed Compounds display page`,
            `Added the ability to hide (and unhide) columns on the compounds
        table view`,
        ],
    },
    {
        version: 'V0.15.0',
        notes: [
            `Explore Compounds graphic now includes size codes, replacing
        program`,
            `For Administration users: Adding new users allows setting
        finance permission`,
            `For Administration users: Manage Users page allows sorting
        and filtering`,
            `For Administration users: Manage Users page adds export user
        list to csv file`,
            `Bug fixes`,
        ],
    },
]
