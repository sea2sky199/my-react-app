import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroller'

import { Spinner } from '..'

function InfiniteTable({retrieveNewRows, view, getSearchAndFilterCriteria, compoundNumberSearchLimit, totalDataLength, getScrollParent, type}) {
  const [loading, setLoading] = React.useState(false);
  const [networkError, setNetworkError] = React.useState(false);

  const loadFunc = () => {
        if (!loading) {
            // console.log('loading more rows')
            setLoading(true)
            try {
                await retrieveNewRows(view.length + 1)
                setLoading(false)
            } catch (err) {
                console.log('Unable to load rows', err)
                this.setState({ networkError: true, loading: false })
                //TODO: Add a way to reload, and revoke networkError
            }
        }
    };

  function errorMessage() {
        const { searchMap } = getSearchAndFilterCriteria()
        const compoundNumberSearchLimit = compoundNumberSearchLimit
        const iscompoundNumberSearchLimitExceeded =
            !!searchMap.compoundNumber &&
            searchMap.compoundNumber.split(' ').length > compoundNumberSearchLimit
        return iscompoundNumberSearchLimitExceeded
            ? `Data retrieval was unsuccessful. Try reducing the compound number search to under ${compoundNumberSearchLimit} compounds.`
            : `Network Error`
    }

  return networkError ? (
            <tbody>
                <tr>
                    <td style={{ paddingLeft: '2rem' }}>{errorMessage}</td>
                </tr>
            </tbody>
        ) : (
            <InfiniteScroll
                element={'tbody'}
                pageStart={0}
                loadMore={loadFunc}
                hasMore={
                    totalDataLength !== 0 &&
                    view.length < (totalDataLength || 1)
                }
                loader={
                    <tr key={'loader'}>
                        <td
                            colSpan={'100%'}
                            style={{
                                height: view.length
                                    ? '90px'
                                    : '78vh',
                                backgroundColor: '#333333'
                            }}
                        >
                            <Spinner
                                style={{
                                    position: 'sticky',
                                    left: 'calc( 50% - 20px )',
                                    margin: '0'
                                }}
                            />
                        </td>
                    </tr>
                }
                useWindow={false}
                getScrollParent={() => getScrollParent()}
            >
                {view.length
                    ? view
                    : !loading &&
                      !(totalDataLength === undefined) && (
                          <tr key={'empty-table'}>
                              <td
                                  colSpan={'100%'}
                                  style={{
                                      textAlign: 'center',
                                      padding: '1rem 0'
                                  }}
                              >
                                  {`No ${type} found matching search criteria.`}
                              </td>
                          </tr>
                      )}
            </InfiniteScroll>
        );
}

export default InfiniteTable
