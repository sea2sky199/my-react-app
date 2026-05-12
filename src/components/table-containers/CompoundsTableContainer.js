import React, { Component, Fragment } from 'react'
import { InfiniteTable, CompoundTableHeadingRow, CompoundRow } from '..'

function CompoundsTableContainer({data, accessors, isSimilarityView, comparisonMethod, sort, updateSort, filterOptions, filterRanges, getSearchAndFilterCriteria, updateFilter, updateSearch, updateFilterRange, retrieveData, getScrollParent, totalDataLength, compoundNumberSearchLimit}) {
  const [rows, setRows] = React.useState(this.renderRows(this.data, this.accessors));
  const prevAccessorsRef = React.useRef();
  const prevDataRef = React.useRef();
  React.useEffect(() => {
    // TODO: add windowing here
        if (
            prevAccessorsRef.current && prevAccessorsRef.current !== accessors ||
            prevDataRef.current && prevDataRef.current !== data
        ) {
            const newRows = renderRows(
                data,
                accessors
            )
            setRows(newRows)
        }
    prevAccessorsRef.current = accessors;
    prevDataRef.current = data;
  }, [data, accessors, isSimilarityView, comparisonMethod, sort, updateSort, filterOptions, filterRanges, getSearchAndFilterCriteria, updateFilter, updateSearch, updateFilterRange, retrieveData, getScrollParent, totalDataLength, compoundNumberSearchLimit]);

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
