import React, { Fragment } from 'react'

export const quantityOfResultsDescription = (isSpaced = false) => (
    <Fragment>
        CompoundMatch assigns a numerical rank to each similarity search result. The
        similarity rank is a simple ordering of the similarity results starting
        at 1 (most similar) to higher numbers (less similar). The similarity
        rank will always be sequential for the compounds displayed, regardless of
        the filtering applied to the results. A compound with a very common shape
        will have many similar results and on quick observation most would agree
        the compounds are similar. Uniquely shaped compounds may only have a vague
        similar appearance. Beyond the ordering of similarity results, CompoundMatch
        does not make judgments about what is a "good" match. Therefore,
        depending upon the compound used to find similar compounds, increasing the
        number of similarity results displayed by the application may show you
        more compounds that are wildly different.{` `}
        {isSpaced && (
            <Fragment>
                <br />
                <br />
            </Fragment>
        )}
        Furthermore, similarity results are based upon geometric shape which
        does not necessarily correlate size. For example, a small eyeglass screw
        might be similar to a larger screw based on shape. Since size is often a
        desirable factor to use when comparing compounds, CompoundMatch has applied a
        size based filter to the similarity results.
    </Fragment>
)
