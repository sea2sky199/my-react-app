import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { autorun } from 'mobx'

import {
    CompoundsTableContainer,
    CompoundsGridContainer,
    CompoundsGridSortDropdown,
    CSVExport,
    CompareToLibraryModal,
    Tooltip,
    FilterCaptions,
    ClickableDiv,
    ColumnConfig,
    ToggleSwitch,
    Opportunity,
    Information,
} from '..'
import './table-container.css'

import { Icon } from 'react-icons-kit'
import { ic_autorenew } from 'react-icons-kit/md/ic_autorenew'

import _ from 'lodash'

import apiService from '../../data/ApiService'
import Slider from '../utility-components/Slider'
import {
    MAX_RESULTS,
    sizeCodeOrder,
    complexityCodeOrder,
    numericCompare,
    combinedSizeCode,
    quantityOfResultsDescription,
    compoundsColumns,
    similarityColumns,
} from '../../utilities'
import Compare from '../compare/Compare'

function AllCompoundsContainer({history, columnsConfigStore, isSimilarityView, compoundInfoForSimilarityView, selectedCompoundStore, userInfoStore, title, compoundsColumnsConfigStore}) {
  const [accessors, setAccessors] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [dataMap, setDataMap] = React.useState(new Map());
  const [queryParam, setQueryParam] = React.useState(this.history.location.search);
  const [totalDataLength, setTotalDataLength] = React.useState(undefined);
  const [filterOptions, setFilterOptions] = React.useState({});
  const [filterRanges, setFilterRanges] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [sort, setSort] = React.useState({
                name: '',
                ascending: true,
            });
  const [isGridView, setIsGridView] = React.useState(isGridView);
  const [isSimilarityView, setIsSimilarityView] = React.useState(this.isSimilarityView);
  const [isCompareCompoundToLibraryModalInView, setIsCompareCompoundToLibraryModalInView] = React.useState(false);
  const [columnsConfigStore, setColumnsConfigStore] = React.useState(null);
  const [n_compounds, setN_compounds] = React.useState(null);
  const gridViewComponent = React.useRef(null);
  const prevQueryParamRef = React.useRef();
  React.useEffect(() => {
    disposers.push(
            autorun(() => {
                setAccessors(columnsConfigStore.accessors)
            })
        )

        disposers.push(
            autorun(() => {
                setColumns(columnsConfigStore.columnsConfig)
            })
        )
    
    return () => {
      clearAndCloseMultiSelection()
        disposers.forEach((disposer) => disposer())
    };
  }, []);
  React.useEffect(() => {
    const needsUpdate =
            history.location.search !== prevQueryParamRef.current
        const alreadyUpdated =
            history.location.search === queryParam
        if (needsUpdate && !alreadyUpdated) {
            console.log(
                'Search or Filter Params Have Changed, Reseting Compound Table'
            )
            setData({
                data: [],
                queryParam: this.props.history.location.search,
                totalDataLength: undefined,
                start: 1,
            })
            updatecompoundNumberSearchInput()
        }
    prevQueryParamRef.current = queryParam;
  }, [history, columnsConfigStore, isSimilarityView, compoundInfoForSimilarityView, selectedCompoundStore, userInfoStore, title, compoundsColumnsConfigStore, data, queryParam, totalDataLength]);

  const updatecompoundNumberSearchInput = () => {
        const { searchMap } = getSearchAndFilterCriteria()
        const compoundNumberSearchInput = document.getElementById(
            'compoundNumber-search-input'
        )
        if (searchMap.compoundNumber && compoundNumberSearchInput) {
            compoundNumberSearchInput.value = searchMap.compoundNumber
        }
    };

  const getSearchAndFilterCriteria = () => {
        const queryString = history.location.search
            ? decodeURI(history.location.search.slice(1))
            : ''
        const parameters = queryString.split('&')

        const filterMap = {}
        const searchMap = {}
        const rangeMap = {}

        const sizeCodeMap = {}

        parameters.forEach((parameter) => {
            if (parameter.includes('filter=')) {
                //will be an array [<group>,<filter>]
                const filterArr = parameter.replace('filter=', '').split(',')
                const group = filterArr[0]
                const filter = decodeURIComponent(filterArr[1])

                if (
                    ((group === 'sizeCode' && !filter.includes('-')) ||
                        group === 'sizeSubCode') &&
                    filter.toUpperCase() !== 'UNCLASSIFIED'
                ) {
                    if (!sizeCodeMap[group]) {
                        sizeCodeMap[group] = []
                    }

                    sizeCodeMap[group].push(filter)
                } else if (group !== 'sizeSubCode') {
                    if (!filterMap[group]) {
                        filterMap[group] = []
                    }

                    filterMap[group].push(filter)
                }
            }
            if (parameter.includes('search=')) {
                //will be an array [<group>,<searchValue>]
                const searchArr = parameter.replace('search=', '').split(',')
                const group = searchArr[0]
                const searchValue = decodeURIComponent(searchArr[1])
                searchMap[group] = searchValue
            }
            if (parameter.includes('range=')) {
                const rangeArr = parameter.replace('range=', '').split(',')
                const group = rangeArr[0]
                const encodedURIComponentRange = rangeArr[1]
                const range = decodeURIComponent(encodedURIComponentRange)
                    .split(',')
                    .map((val) => parseFloat(val))
                rangeMap[group] = range
            }
        })

        let combined = combinedSizeCode(sizeCodeMap)

        if (combined) {
            filterMap['sizeCode'] = !!filterMap['sizeCode']
                ? [...filterMap['sizeCode'], ...combined]
                : combined
        }

        return {
            filterMap,
            searchMap,
            rangeMap,
        }
    };

  const getComparison = (accessor, filterOptions) => {
        if (accessor === 'sizeCode') {
            return (a, b) =>
                numericCompare(
                    sizeCodeOrder.indexOf(a),
                    sizeCodeOrder.indexOf(b)
                )
        } else if (accessor === 'complexityCode') {
            return (a, b) =>
                numericCompare(
                    complexityCodeOrder.indexOf(a),
                    complexityCodeOrder.indexOf(b)
                )
        }

        return (a, b) =>
            numericCompare(
                filterOptions[accessor][a],
                filterOptions[accessor][b]
            )
    };

  const getCleanedcompoundNumberSearchArray = (compoundNumberString) => {
        compoundNumberString = compoundNumberString.replace(/[,;\t]/g, ' ')
        const compoundNumbersToBeSearched = compoundNumberString
            .split(' ')
            .filter((compoundNumber) => compoundNumber.trim() !== '')
        return [...new Set(compoundNumbersToBeSearched)]
    };

  const getCSVHeaders = (data) => {
        if (!data.length) {
            return []
        }

        const defaultColumnConfig = isSimilarityView
            ? similarityColumns
            : compoundsColumns

        const accessors = Array.from(defaultColumnConfig.keys()).filter(
            (name) => defaultColumnConfig.get(name).visible
        )

        return accessors.map((accessor) => {
            const label = columns.get(accessor).title
            return {
                key: accessor,
                label,
            }
        })
    };

  const getCompoundsRequestBody = (start, compoundRequestLimit = 25) => {
        const {
            filterMap,
            searchMap,
            rangeMap,
        } = getSearchAndFilterCriteria()

        if (searchMap.compoundNumber) {
            //multi compound search can be split by whitespace, comma, or semi-colon
            const compoundNumbersToBeSearchedArray = getCleanedcompoundNumberSearchArray(
                searchMap.compoundNumber
            )
            searchMap.compoundNumber = compoundNumbersToBeSearchedArray.join(' ')
            compoundRequestLimit = Math.max(
                compoundRequestLimit,
                compoundNumbersToBeSearchedArray.length
            )
        }

        let body = {
            filters: filterMap,
            search: searchMap,
            range_filters: rangeMap,
            start: start,
            limit: compoundRequestLimit,
        }

        if (isSimilarityView) {
            body = {
                ...body,
                n_compounds: n_compounds || 25,
                compound_number: compoundInfoForSimilarityView.compoundNumber,
            }
        }

        if (sort.name) {
            const sort = {
                [sort.name]: sort.ascending
                    ? 'ascending'
                    : 'descending',
            }

            body = { ...body, sort }
        }

        return body
    };

  const multiCompoundSelectionViewExportCompoundRequest = () => {
        let reqBody = {
            selected: selectedCompoundStore.selectedcompoundNumbers,
            start: 1,
            limit: selectedCompoundStore.selectedcompoundNumbers.length,
        }
        if (isSimilarityView) {
            reqBody = {
                ...reqBody,
                n_compounds: 999,
                compound_number: compoundInfoForSimilarityView.compoundNumber,
            }
        }
        return apiService.post('compounds', reqBody)
    };

  const compoundsRequest = (start, compoundRequestLimit = 25) => {
        const reqBody = getCompoundsRequestBody(start, compoundRequestLimit)
        return apiService.post('compounds', reqBody)
    };

  const retrieveData = (start = 1) => {
        setLoading(true)

        const queryString = history.location.search
        const res = await compoundsRequest(start)

        if (typeof res !== 'object') {
            throw new Error('Network Error: Please check your connection.')
        }

        if (res.results.length === 0) {
            let newState = { loading: false }

            if (data.length === 0) {
                newState = {
                    ...newState,
                    totalDataLength: 0,
                    data: [],
                }
            }

            this.setState(newState)

            return
        }

        const isCurrentQueryUpToDate =
            queryString === history.location.search

        if (isCurrentQueryUpToDate) {
            if (start === 1) {
                //first request for a particular filter (data.length+1 === 1)
                const filterOptions = await getFilterOptions()
                const wasSortInstantiated = !!sort.name

                this.setState({
                    totalDataLength: res.count,
                    data: res.results,
                    filterOptions: filterOptions,
                    filterRanges: res.ranges,
                    loading: false,
                    sort: {
                        name: wasSortInstantiated
                            ? sort.name
                            : accessors[0],
                        ascending: wasSortInstantiated
                            ? sort.ascending
                            : true,
                    },
                })
            } else {
                this.setState({
                    data: data.concat(res.results),
                    loading: false,
                })
            }

            setDataMap(new Map([
                    ...dataMap.entries(),
                    ...res.results.map((row) => [row.compoundNumber, row]),
                ]))
        }
    };

  const getFilterOptions = () => {
        const res = await apiService.get('compoundsMetadata')

        if (typeof res !== 'object') {
            throw new Error('Network Error: Please check your connection.')
        }

        const filterMap = {}

        res.forEach((datum) => {
            if (!filterMap[datum.grouping]) {
                filterMap[datum.grouping] = {}
            }

            filterMap[datum.grouping][datum.name] = datum.total
        })

        return filterMap
    };

  const clearFilters = () => {
        document
            .getElementsByClassName('compounds-search-input')
            .forEach((node) => (node.value = ''))

        history.push(`${history.location.pathname}`, {
            ...history.location.state,
        })
    };

  const getPermittedAcessors = (accessors) => {
        const isCompoundMetadataInstantiated = !!Object.keys(
            filterOptions
        ).length
        if (!isCompoundMetadataInstantiated) {
            return []
        }

        const financePermission = !!userInfoStore.userInfo
            .finance_permission
        return accessors.filter((accessor) => {
            const isFinanceAccessor = columnsConfigStore.columnsConfig.get(
                accessor
            ).financeAccessor
            if (isFinanceAccessor) {
                return financePermission
            } else {
                return true
            }
        })
    };

  const getUpdatedQueryString = (
        update,
        updateGrouping,
        type,
        remove = false,
        clearAll = false,
        clearFilterTypeBeforeUpdate = ''
    ) => {
        if (clearAll) {
            return ''
        }

        const { filterMap } = getSearchAndFilterCriteria()

        let currentQueryStringArr = history.location.search
            ? decodeURI(history.location.search.slice(1)).split('&')
            : []

        currentQueryStringArr = currentQueryStringArr.map((query) => {
            if (query.indexOf('filter=') > -1) {
                const [group, filter] = query.replace('filter=', '').split(',')
                if (
                    group === 'sizeCode' &&
                    filter.indexOf('-') < 0 &&
                    filter.indexOf('UNCLASSIFIED') < 0
                ) {
                    const filterGroupQuery = filterMap[group]
                        .filter((value) => value !== update)
                        .map((value) => `filter=sizeCode,${value}`)

                    return filterGroupQuery.join('&')
                }
            }

            return query
        })

        if (clearFilterTypeBeforeUpdate !== '') {
            currentQueryStringArr = currentQueryStringArr.filter((string) => {
                return !string.includes(clearFilterTypeBeforeUpdate)
            })
        }

        if (!remove) {
            if (type === 'search' || type === 'range') {
                currentQueryStringArr = currentQueryStringArr.filter(
                    (string) => !(string.indexOf(updateGrouping) > -1)
                )
            }
            if (update) {
                currentQueryStringArr.push(
                    `${type}=${updateGrouping},${encodeURIComponent(update)}`
                )
            }
        } else {
            currentQueryStringArr = currentQueryStringArr.filter(
                (string) =>
                    !(
                        string.indexOf(
                            `${updateGrouping},${encodeURIComponent(update)}`
                        ) > -1
                    )
            )
        }

        return encodeURI(`?${currentQueryStringArr.join('&')}`)
    };

  const updateFilterRange = (
        values,
        grouping,
        remove = false,
        clearAll = false
    ) => {
        const queryString = getUpdatedQueryString(
            values,
            grouping,
            'range',
            remove,
            clearAll
        )
        history.push(
            `${history.location.pathname}${queryString}`,
            { ...history.location.state }
        )
    };

  updateSearch = _.debounce(
        (
            value = '',
            grouping = '',
            clearAll = false,
            clearFilterTypeBeforeUpdate = ''
        ) => {
            const queryString = this.getUpdatedQueryString(
                value,
                grouping,
                'search',
                false,
                clearAll,
                clearFilterTypeBeforeUpdate
            )
            history.push(
                `${history.location.pathname}${queryString}`,
                { ...history.location.state }
            )
        },
        500
    )

  const updateFilter = (
        filter = '',
        grouping = '',
        remove = false,
        clearAll = false
    ) => {
        const queryString = getUpdatedQueryString(
            filter,
            grouping,
            'filter',
            remove,
            clearAll
        )
        history.push(
            `${history.location.pathname}${queryString}`,
            { ...history.location.state }
        )
    };

  const updateSort = (accessor, isAscending = undefined) => {
        let ascendingUpdateValue
        if (isAscending !== undefined) {
            ascendingUpdateValue = isAscending
        } else {
            const isAccessorSortBeingToggled = accessor === sort.name
            ascendingUpdateValue = isAccessorSortBeingToggled
                ? !sort.ascending
                : true
        }

        const sort = {
            name: accessor,
            ascending: ascendingUpdateValue,
        }

        this.setState({
            sort: sort,
            data: [],
            totalDataLength: undefined,
            start: 1,
        })
    };

  const getcompoundNumbersNotFound = (searchValue, data) => {
        if (!searchValue) {
            return []
        }
        const searchValuesArray = getCleanedcompoundNumberSearchArray(
            searchValue
        )
        const compoundNumbersReturned = data.map(
            (partObj) => partObj.compoundNumberClean
        )

        //if only one search value, compoundNumber has trailing wildcard
        if (searchValuesArray.length <= 1 && compoundNumbersReturned.length > 0) {
            return []
        }

        return searchValuesArray.filter(
            (compoundNumber) =>
                compoundNumber.trim() !== '' &&
                !compoundNumbersReturned.includes(compoundNumber)
        )
    };

  const rendercompoundNumbersNotFound = (underCompoundsHeader = false) => {
        const { searchMap } = getSearchAndFilterCriteria()
        const compoundNumbersNotFound = getcompoundNumbersNotFound(
            searchMap.compoundNumber,
            data
        )

        if (
            !searchMap.compoundNumber ||
            !compoundNumbersNotFound.length ||
            loading
        ) {
            return
        }

        const classNamesArray = ['h7', 'semi-thin', 'letter-spacing']
        if (!underCompoundsHeader) {
            classNamesArray.push('compoundNumber-search-not-found-container')
        } else {
            classNamesArray.push('compounds-result-caption-container')
        }

        return (
            <div className={classNamesArray.join(' ')}>
                {`Compound ${
                    compoundNumbersNotFound.length > 1 ? 'Numbers' : 'Number'
                } Not Found: `}
                {getcompoundNumbersNotFound(
                    getSearchAndFilterCriteria().searchMap.compoundNumber,
                    data
                ).join(', ')}
            </div>
        )
    };

  const clearSelectedCompounds = () => {
        selectedCompoundStore.setSelectedcompoundNumbers([])
    };

  const toggleMultiSelectView = () => {
        if (selectedCompoundStore.isMultiSelectView) {
            clearSelectedCompounds()
        }
        selectedCompoundStore.toggleMultiSelectView()
    };

  const clearAndCloseMultiSelection = () => {
        if (selectedCompoundStore.isMultiSelectView) {
            toggleMultiSelectView()
        }
    };

  compoundNumberSearchLimit = 250

  const getScrollParent = () => {
        return scrollParentRef
    };

  const areFiltersApplied = !!history.location.search.length
        const {
            filterMap,
            rangeMap,
            searchMap,
        } = getSearchAndFilterCriteria()
        return (
            <Fragment>
                {isSimilarityView &&
                    isCompareCompoundToLibraryModalInView && (
                        <CompareToLibraryModal
                            compoundInfo={compoundInfoForSimilarityView}
                            comparison="Similar Results"
                            close={() =>
                                setIsCompareCompoundToLibraryModalInView(false)
                            }
                            isSimilar={isSimilarityView}
                        />
                    )}
                <div className="DataTable padding-top-nav-breadcrumb">
                    <div className="TableCaptionBar flex align-center space-between h2 letter-spacing">
                        <div
                            className="flex align-center"
                            style={
                                isGridView
                                    ? { paddingLeft: '2rem' }
                                    : {}
                            }
                        >
                            <div>
                                <div className="h0 semi-bold">{`${
                                    title || 'Compounds'
                                }`}</div>
                                {selectedCompoundStore
                                    .isMultiSelectView &&
                                    !!selectedCompoundStore
                                        .selectedcompoundNumbers.length && (
                                        <div className="compounds-selected-caption h7 semi-thin">{`${selectedCompoundStore.selectedcompoundNumbers.length} Selected`}</div>
                                    )}
                                {!isSimilarityView && (
                                    <div
                                        className="h5 semi-thin"
                                        style={{ paddingTop: '0.25rem' }}
                                    >
                                        {totalDataLength
                                            ? `${totalDataLength} ${
                                                  totalDataLength ===
                                                  1
                                                      ? 'Result'
                                                      : 'Results'
                                              }`
                                            : rendercompoundNumbersNotFound(
                                                  true
                                              )}
                                    </div>
                                )}
                            </div>
                            {isGridView && areFiltersApplied && (
                                <Tooltip
                                    data={
                                        <span style={{ color: 'black' }}>
                                            <FilterCaptions
                                                filterMap={filterMap}
                                                rangeMap={rangeMap}
                                                searchMap={searchMap}
                                            />
                                        </span>
                                    }
                                    forcePositionDown={true}
                                    backgroundColor="#ffffff"
                                >
                                    <div
                                        className="h6-5 semi-bold pointer"
                                        style={{
                                            paddingLeft: '1rem',
                                            color: '#ef88b8',
                                        }}
                                        onClick={() =>
                                            gridViewComponent.current.toggleGridFilterControls()
                                        }
                                    >
                                        FILTERS APPLIED
                                    </div>
                                </Tooltip>
                            )}
                            {totalDataLength &&
                            totalDataLength > 0
                                ? rendercompoundNumbersNotFound(false)
                                : null}
                        </div>
                        <div className="flex" style={{ maxWidth: '85%' }}>
                            {areFiltersApplied && !isGridView && (
                                <div className="TableCaptionBarFilterContainer flex align-center">
                                    <ClickableDiv
                                        classNameArr={['reset-filters', 'h5']}
                                        clickAction={clearFilters}
                                    >
                                        Reset Filters x
                                    </ClickableDiv>
                                </div>
                            )}
                            <div className="TableCaptionBarButtonContainer flex align-center justify-end">
                                <ToggleSwitch
                                    checked={
                                        selectedCompoundStore
                                            .isMultiSelectView
                                    }
                                    toggle={toggleMultiSelectView}
                                />
                                <button
                                    className="TableCaptionBarButton h6 pointer flex align-center"
                                    onClick={() =>
                                        setIsGridView(!isGridView)
                                    }
                                >
                                    {isGridView
                                        ? 'Table View'
                                        : 'Grid View'}
                                    <Icon
                                        style={{
                                            marginRight: '-0.25rem',
                                            paddingLeft: '0.5rem',
                                        }}
                                        icon={ic_autorenew}
                                        size={16}
                                    />
                                </button>
                                <Opportunity
                                    totalDataLength={
                                        totalDataLength || 0
                                    }
                                    dataRequest={
                                        selectedCompoundStore
                                            .isMultiSelectView
                                            ? multiCompoundSelectionViewExportCompoundRequest
                                            : compoundsRequest
                                    }
                                />
                                <Compare
                                    data={dataMap}
                                    selectedCompounds={
                                        selectedCompoundStore
                                            .selectedcompoundNumbers
                                    }
                                    showing={
                                        selectedCompoundStore
                                            .isMultiSelectView
                                    }
                                />
                                <CSVExport
                                    exportType="compounds"
                                    exportLimit={5000}
                                    totalDataLength={
                                        selectedCompoundStore
                                            .isMultiSelectView
                                            ? selectedCompoundStore
                                                  .selectedcompoundNumbers.length
                                            : totalDataLength
                                    }
                                    headers={getCSVHeaders(
                                        data
                                    )}
                                    classNamesArray={[
                                        'TableCaptionBarButton',
                                        'h6',
                                        'pointer',
                                        'flex',
                                        'align-center',
                                    ]}
                                    dataRequest={
                                        selectedCompoundStore
                                            .isMultiSelectView
                                            ? multiCompoundSelectionViewExportCompoundRequest
                                            : compoundsRequest
                                    }
                                />
                                {isSimilarityView &&
                                    !selectedCompoundStore
                                        .isMultiSelectView && (
                                        <button
                                            className="TableCaptionBarButton h6 pointer"
                                            onClick={() =>
                                                setIsCompareCompoundToLibraryModalInView(true)
                                            }
                                        >
                                            Compare Compound to Results
                                        </button>
                                    )}
                                {isGridView && (
                                    <CompoundsGridSortDropdown
                                        options={getPermittedAcessors(
                                            accessors
                                        )}
                                        sort={sort}
                                        updateSort={updateSort}
                                        style={
                                            !getPermittedAcessors(
                                                accessors
                                            ).length
                                                ? {
                                                      opacity: 0.5,
                                                      pointerEvents: 'none',
                                                  }
                                                : {}
                                        }
                                    />
                                )}

                                {isSimilarityView && (
                                    <label
                                        htmlFor="limit_results"
                                        className="slider-container results"
                                    >
                                        <span className="slider-label nowrap">
                                            Quantity of Results
                                            <Information
                                                header="Quantity of Results"
                                                eventName="showQuantityOfResults"
                                                popOut={true}
                                            >
                                                <div className="quantity-of-results-description-body h6 semi-thin wrap-normal">
                                                    {quantityOfResultsDescription(
                                                        true
                                                    )}
                                                </div>
                                            </Information>
                                        </span>
                                        <span className="slider-sublabel">
                                            Less
                                        </span>
                                        <Slider
                                            values={[
                                                25,
                                                50,
                                                100,
                                                200,
                                                500,
                                                MAX_RESULTS,
                                            ]}
                                            changed={(value) =>
                                                setData({
                                                    n_compounds: value,
                                                    data: [],
                                                    totalDataLength: undefined,
                                                    start: 1,
                                                })
                                            }
                                            id="limit_results"
                                            width="10rem"
                                        />
                                        <span className="slider-sublabel">
                                            More
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                    {!!getPermittedAcessors(accessors).length &&
                        !isGridView && (
                            <ColumnConfig
                                columnsConfigStore={
                                    columnsConfigStore
                                }
                                isSimilarityView={isSimilarityView}
                                savedColumnConfig={
                                    isSimilarityView
                                        ? userInfoStore.userInfo
                                              .similarity_column_config
                                        : userInfoStore.userInfo
                                              .column_config
                                }
                                userId={userInfoStore.userInfo.id}
                            />
                        )}
                    <div
                        className="ScrollContainer"
                        ref={(ref) => {
                            if (!ref) {
                                return
                            }
                            return (scrollParentRef = ref)
                        }}
                    >
                        {isGridView ? (
                            <div className="Grid">
                                <CompoundsGridContainer
                                    ref={gridViewComponent}
                                    data={data}
                                    retrieveData={retrieveData}
                                    getScrollParent={getScrollParent}
                                    totalDataLength={totalDataLength}
                                    isSimilarityView={
                                        isSimilarityView
                                    }
                                    accessors={getPermittedAcessors(
                                        accessors
                                    )}
                                    sort={sort}
                                    updateSort={updateSort}
                                    filterOptions={filterOptions}
                                    filterRanges={filterRanges}
                                    getSearchAndFilterCriteria={
                                        getSearchAndFilterCriteria
                                    }
                                    updateSearch={updateSearch}
                                    updateFilter={updateFilter}
                                    updateFilterRange={updateFilterRange}
                                    compoundNumberSearchLimit={
                                        compoundNumberSearchLimit
                                    }
                                />
                            </div>
                        ) : (
                            <CompoundsTableContainer
                                data={data}
                                accessors={getPermittedAcessors(
                                    accessors
                                )}
                                retrieveData={retrieveData}
                                sort={sort}
                                updateSort={updateSort}
                                filterOptions={filterOptions}
                                comparisonMethod={getComparison}
                                filterRanges={filterRanges}
                                getSearchAndFilterCriteria={
                                    getSearchAndFilterCriteria
                                }
                                updateSearch={updateSearch}
                                updateFilter={updateFilter}
                                updateFilterRange={updateFilterRange}
                                isSimilarityView={isSimilarityView}
                                isLoading={loading}
                                getScrollParent={getScrollParent}
                                totalDataLength={totalDataLength}
                                compoundNumberSearchLimit={
                                    compoundNumberSearchLimit
                                }
                            />
                        )}
                    </div>
                </div>
            </Fragment>
        );
}

export default withRouter(
    inject(
        'userInfoStore',
        'selectedCompoundStore',
        'compoundsColumnsConfigStore'
    )(observer(AllCompoundsContainer))
)
