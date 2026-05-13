import React, { Fragment } from 'react'
import CompoundRow from '../table-utilities/CompoundRow'
import CompoundTableHeadingRow from '../table-utilities/CompoundTableHeadingRow'
import InfiniteTable from '../table-utilities/InfiniteTable'

function CompoundsTableContainer({data, accessors, isSimilarityView, comparisonMethod, sort, updateSort, filterOptions, filterRanges, getSearchAndFilterCriteria, updateFilter, updateSearch, updateFilterRange, retrieveData, getScrollParent, totalDataLength, compoundNumberSearchLimit}) {

  const renderRows = (data, headings) => {
        return data.map(compoundInfo => (
            <CompoundRow
                key={`${compoundInfo.compoundNumber}-row`}
                compoundInfo={compoundInfo}
                headings={headings}
                isSimilarityView={isSimilarityView}
            />
        ))
    };

  const rows = React.useMemo(
        () => renderRows(data, accessors),
        [data, accessors, isSimilarityView]
    );

  return (
            <Fragment>
                <table className="Table compounds">
                    {!!accessors.length && (
                        <CompoundTableHeadingRow
                            accessors={accessors}
                            comparisonMethod={comparisonMethod}
                            sort={sort}
                            updateSort={updateSort}
                            filterOptions={filterOptions}
                            filterRanges={filterRanges}
                            getSearchAndFilterCriteria={
                                getSearchAndFilterCriteria
                            }
                            updateFilter={updateFilter}
                            updateSearch={updateSearch}
                            updateFilterRange={updateFilterRange}
                        />
                    )}
                    <InfiniteTable
                        type={'compounds'}
                        retrieveNewRows={retrieveData}
                        getScrollParent={getScrollParent}
                        totalDataLength={totalDataLength}
                        view={rows}
                        getSearchAndFilterCriteria={
                            getSearchAndFilterCriteria
                        }
                        compoundNumberSearchLimit={compoundNumberSearchLimit}
                    />
                </table>
            </Fragment>
        );
}

export default CompoundsTableContainer
