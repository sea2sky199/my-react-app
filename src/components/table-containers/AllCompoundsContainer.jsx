import React, { Fragment } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import CSVExport from '../csv/CSVExport'
import FilterCaptions from '../filter-utilities/FilterCaptions'
import Information from '../information-modal/Information'
import { CompoundsGridContainer, CompoundsGridSortDropdown, CompareToLibraryModal, Opportunity } from '../stubs'
import CompoundsTableContainer from './CompoundsTableContainer'
import ColumnConfig from '../table-utilities/ColumnConfig'
import ClickableDiv from '../utility-components/ClickableDiv'
import ToggleSwitch from '../utility-components/ToggleSwitch'
import Tooltip from '../utility-components/Tooltip'
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

function AllCompoundsContainer({columnsConfigStore, isSimilarityView, compoundInfoForSimilarityView, selectedCompoundStore, userInfoStore, title, compoundsColumnsConfigStore}) {
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = React.useRef(location);
  React.useEffect(() => { locationRef.current = location }, [location]);

  const [accessors, setAccessors] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [dataMap, setDataMap] = React.useState(new Map());
  const [totalDataLength, setTotalDataLength] = React.useState(undefined);
  const [filterOptions, setFilterOptions] = React.useState({});
  const [filterRanges, setFilterRanges] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [sort, setSort] = React.useState({ name: '', ascending: true });
  const [isGridView, setIsGridView] = React.useState(false);
  const [isCompareCompoundToLibraryModalInView, setIsCompareCompoundToLibraryModalInView] = React.useState(false);
  const [n_compounds, setN_compounds] = React.useState(null);
  const gridViewComponent = React.useRef(null);
  const scrollParentRef = React.useRef(null);

  const compoundNumberSearchLimit = 250

  const clearAndCloseMultiSelection = () => {
        if (selectedCompoundStore && selectedCompoundStore.isMultiSelectView) {
            toggleMultiSelectView()
        }
    };

  React.useEffect(() => {
        if (columnsConfigStore) {
            setAccessors(columnsConfigStore.accessors || [])
            setColumns(columnsConfigStore.columnsConfig || [])
        }
  }, [columnsConfigStore]);

  React.useEffect(() => {
        return () => {
            clearAndCloseMultiSelection()
        };
  }, []);

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        setData([])
        setTotalDataLength(undefined)
        updatecompoundNumberSearchInput()
  }, [location.search]);

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
        const queryString = locationRef.current.search
            ? decodeURI(locationRef.current.search.slice(1))
            : ''
        const parameters = queryString.split('&')

        const filterMap = {}
        const searchMap = {}
        const rangeMap = {}
        const sizeCodeMap = {}

        parameters.forEach((parameter) => {
            if (parameter.includes('filter=')) {
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

        return { filterMap, searchMap, rangeMap }
    };

  const getComparison = (accessor, opts) => {
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
                opts[accessor][a],
                opts[accessor][b]
            )
    };

  const getCleanedcompoundNumberSearchArray = (compoundNumberString) => {
        compoundNumberString = compoundNumberString.replace(/[,;\t]/g, ' ')
        const compoundNumbersToBeSearched = compoundNumberString
            .split(' ')
            .filter((compoundNumber) => compoundNumber.trim() !== '')
        return [...new Set(compoundNumbersToBeSearched)]
    };

  const getCSVHeaders = (tableData) => {
        if (!tableData.length) {
            return []
        }

        const defaultColumnConfig = isSimilarityView
            ? similarityColumns
            : compoundsColumns

        const visibleAccessors = Array.from(defaultColumnConfig.keys()).filter(
            (name) => defaultColumnConfig.get(name).visible
        )

        return visibleAccessors.map((accessor) => {
            const col = columns.get ? columns.get(accessor) : null
            const label = col ? col.title : accessor
            return { key: accessor, label }
        })
    };

  const getCompoundsRequestBody = (start, compoundRequestLimit = 25) => {
        const { filterMap, searchMap, rangeMap } = getSearchAndFilterCriteria()

        if (searchMap.compoundNumber) {
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
            const sortBody = {
                [sort.name]: sort.ascending ? 'ascending' : 'descending',
            }
            body = { ...body, sort: sortBody }
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

  const getFilterOptions = async () => {
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

  const retrieveData = async (start = 1) => {
        setLoading(true)
        const queryStringAtStart = locationRef.current.search
        const res = await compoundsRequest(start)

        if (typeof res !== 'object') {
            throw new Error('Network Error: Please check your connection.')
        }

        if (res.results.length === 0) {
            setLoading(false)
            if (data.length === 0) {
                setTotalDataLength(0)
                setData([])
            }
            return
        }

        const isCurrentQueryUpToDate = queryStringAtStart === locationRef.current.search

        if (isCurrentQueryUpToDate) {
            if (start === 1) {
                const newFilterOptions = await getFilterOptions()
                const wasSortInstantiated = !!sort.name
                setTotalDataLength(res.count)
                setData(res.results)
                setFilterOptions(newFilterOptions)
                setFilterRanges(res.ranges)
                setLoading(false)
                setSort({
                    name: wasSortInstantiated ? sort.name : accessors[0],
                    ascending: wasSortInstantiated ? sort.ascending : true,
                })
            } else {
                setData(prev => [...prev, ...res.results])
                setLoading(false)
            }
            setDataMap(prev => new Map([
                ...prev.entries(),
                ...res.results.map((row) => [row.compoundNumber, row]),
            ]))
        }
    };

  const clearFilters = () => {
        Array.from(document.getElementsByClassName('compounds-search-input'))
            .forEach((node) => (node.value = ''))
        navigate(locationRef.current.pathname, { state: { ...locationRef.current.state } })
    };

  const getPermittedAcessors = (accs) => {
        const isCompoundMetadataInstantiated = !!Object.keys(filterOptions).length
        if (!isCompoundMetadataInstantiated) {
            return []
        }

        const financePermission = !!(userInfoStore && userInfoStore.userInfo && userInfoStore.userInfo.finance_permission)
        return accs.filter((accessor) => {
            const colConfig = columnsConfigStore && columnsConfigStore.columnsConfig.get
                ? columnsConfigStore.columnsConfig.get(accessor)
                : null
            const isFinanceAccessor = colConfig ? colConfig.financeAccessor : false
            return isFinanceAccessor ? financePermission : true
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

        let currentQueryStringArr = locationRef.current.search
            ? decodeURI(locationRef.current.search.slice(1)).split('&')
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

  const updateFilterRange = (values, grouping, remove = false, clearAll = false) => {
        const queryString = getUpdatedQueryString(values, grouping, 'range', remove, clearAll)
        navigate(
            `${locationRef.current.pathname}${queryString}`,
            { state: { ...locationRef.current.state } }
        )
    };

  const updateSearch = _.debounce((
        value = '',
        grouping = '',
        clearAll = false,
        clearFilterTypeBeforeUpdate = ''
    ) => {
        const queryString = getUpdatedQueryString(
            value, grouping, 'search', false, clearAll, clearFilterTypeBeforeUpdate
        )
        navigate(
            `${locationRef.current.pathname}${queryString}`,
            { state: { ...locationRef.current.state } }
        )
    }, 500)

  const updateFilter = (filter = '', grouping = '', remove = false, clearAll = false) => {
        const queryString = getUpdatedQueryString(filter, grouping, 'filter', remove, clearAll)
        navigate(
            `${locationRef.current.pathname}${queryString}`,
            { state: { ...locationRef.current.state } }
        )
    };

  const updateSort = (accessor, isAscending = undefined) => {
        let ascendingUpdateValue
        if (isAscending !== undefined) {
            ascendingUpdateValue = isAscending
        } else {
            const isAccessorSortBeingToggled = accessor === sort.name
            ascendingUpdateValue = isAccessorSortBeingToggled ? !sort.ascending : true
        }
        setSort({ name: accessor, ascending: ascendingUpdateValue })
        setData([])
        setTotalDataLength(undefined)
    };

  const getcompoundNumbersNotFound = (searchValue, tableData) => {
        if (!searchValue) {
            return []
        }
        const searchValuesArray = getCleanedcompoundNumberSearchArray(searchValue)
        const compoundNumbersReturned = tableData.map((partObj) => partObj.compoundNumberClean)

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
        const compoundNumbersNotFound = getcompoundNumbersNotFound(searchMap.compoundNumber, data)

        if (!searchMap.compoundNumber || !compoundNumbersNotFound.length || loading) {
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
                {`Compound ${compoundNumbersNotFound.length > 1 ? 'Numbers' : 'Number'} Not Found: `}
                {compoundNumbersNotFound.join(', ')}
            </div>
        )
    };

  const clearSelectedCompounds = () => {
        if (selectedCompoundStore) {
            selectedCompoundStore.setSelectedcompoundNumbers([])
        }
    };

  const toggleMultiSelectView = () => {
        if (selectedCompoundStore) {
            if (selectedCompoundStore.isMultiSelectView) {
                clearSelectedCompounds()
            }
            selectedCompoundStore.toggleMultiSelectView()
        }
    };

  const getScrollParent = () => {
        return scrollParentRef.current
    };

  const areFiltersApplied = !!location.search.length
        const { filterMap, rangeMap, searchMap } = getSearchAndFilterCriteria()
        return (
            <Fragment>
                {isSimilarityView && isCompareCompoundToLibraryModalInView && (
                    <CompareToLibraryModal
                        compoundInfo={compoundInfoForSimilarityView}
                        comparison="Similar Results"
                        close={() => setIsCompareCompoundToLibraryModalInView(false)}
                        isSimilar={isSimilarityView}
                    />
                )}
                <div className="DataTable padding-top-nav-breadcrumb">
                    <div className="TableCaptionBar flex align-center space-between h2 letter-spacing">
                        <div
                            className="flex align-center"
                            style={isGridView ? { paddingLeft: '2rem' } : {}}
                        >
                            <div>
                                <div className="h0 semi-bold">{`${title || 'Compounds'}`}</div>
                                {selectedCompoundStore && selectedCompoundStore.isMultiSelectView &&
                                    !!selectedCompoundStore.selectedcompoundNumbers.length && (
                                        <div className="compounds-selected-caption h7 semi-thin">
                                            {`${selectedCompoundStore.selectedcompoundNumbers.length} Selected`}
                                        </div>
                                    )}
                                {!isSimilarityView && (
                                    <div className="h5 semi-thin" style={{ paddingTop: '0.25rem' }}>
                                        {totalDataLength
                                            ? `${totalDataLength} ${totalDataLength === 1 ? 'Result' : 'Results'}`
                                            : rendercompoundNumbersNotFound(true)}
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
                                        style={{ paddingLeft: '1rem', color: '#ef88b8' }}
                                        onClick={() =>
                                            gridViewComponent.current && gridViewComponent.current.toggleGridFilterControls()
                                        }
                                    >
                                        FILTERS APPLIED
                                    </div>
                                </Tooltip>
                            )}
                            {totalDataLength && totalDataLength > 0
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
                                    checked={selectedCompoundStore && selectedCompoundStore.isMultiSelectView}
                                    toggle={toggleMultiSelectView}
                                />
                                <button
                                    className="TableCaptionBarButton h6 pointer flex align-center"
                                    onClick={() => setIsGridView(!isGridView)}
                                >
                                    {isGridView ? 'Table View' : 'Grid View'}
                                    <Icon
                                        style={{ marginRight: '-0.25rem', paddingLeft: '0.5rem' }}
                                        icon={ic_autorenew}
                                        size={16}
                                    />
                                </button>
                                <Opportunity
                                    totalDataLength={totalDataLength || 0}
                                    dataRequest={
                                        selectedCompoundStore && selectedCompoundStore.isMultiSelectView
                                            ? multiCompoundSelectionViewExportCompoundRequest
                                            : compoundsRequest
                                    }
                                />
                                <Compare
                                    data={dataMap}
                                    selectedCompounds={selectedCompoundStore && selectedCompoundStore.selectedcompoundNumbers}
                                    showing={selectedCompoundStore && selectedCompoundStore.isMultiSelectView}
                                />
                                <CSVExport
                                    exportType="compounds"
                                    exportLimit={5000}
                                    totalDataLength={
                                        selectedCompoundStore && selectedCompoundStore.isMultiSelectView
                                            ? selectedCompoundStore.selectedcompoundNumbers.length
                                            : totalDataLength
                                    }
                                    headers={getCSVHeaders(data)}
                                    classNamesArray={[
                                        'TableCaptionBarButton',
                                        'h6',
                                        'pointer',
                                        'flex',
                                        'align-center',
                                    ]}
                                    dataRequest={
                                        selectedCompoundStore && selectedCompoundStore.isMultiSelectView
                                            ? multiCompoundSelectionViewExportCompoundRequest
                                            : compoundsRequest
                                    }
                                />
                                {isSimilarityView && selectedCompoundStore && !selectedCompoundStore.isMultiSelectView && (
                                    <button
                                        className="TableCaptionBarButton h6 pointer"
                                        onClick={() => setIsCompareCompoundToLibraryModalInView(true)}
                                    >
                                        Compare Compound to Results
                                    </button>
                                )}
                                {isGridView && (
                                    <CompoundsGridSortDropdown
                                        options={getPermittedAcessors(accessors)}
                                        sort={sort}
                                        updateSort={updateSort}
                                        style={
                                            !getPermittedAcessors(accessors).length
                                                ? { opacity: 0.5, pointerEvents: 'none' }
                                                : {}
                                        }
                                    />
                                )}
                                {isSimilarityView && (
                                    <label htmlFor="limit_results" className="slider-container results">
                                        <span className="slider-label nowrap">
                                            Quantity of Results
                                            <Information header="Quantity of Results" popOut={true}>
                                                <div className="quantity-of-results-description-body h6 semi-thin wrap-normal">
                                                    {quantityOfResultsDescription(true)}
                                                </div>
                                            </Information>
                                        </span>
                                        <span className="slider-sublabel">Less</span>
                                        <Slider
                                            values={[25, 50, 100, 200, 500, MAX_RESULTS]}
                                            changed={(value) => {
                                                setN_compounds(value)
                                                setData([])
                                                setTotalDataLength(undefined)
                                            }}
                                            id="limit_results"
                                            width="10rem"
                                        />
                                        <span className="slider-sublabel">More</span>
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                    {!!getPermittedAcessors(accessors).length && !isGridView && (
                        <ColumnConfig
                            columnsConfigStore={columnsConfigStore}
                            isSimilarityView={isSimilarityView}
                            savedColumnConfig={
                                isSimilarityView
                                    ? userInfoStore && userInfoStore.userInfo && userInfoStore.userInfo.similarity_column_config
                                    : userInfoStore && userInfoStore.userInfo && userInfoStore.userInfo.column_config
                            }
                            userId={userInfoStore && userInfoStore.userInfo && userInfoStore.userInfo.id}
                        />
                    )}
                    <div className="ScrollContainer" ref={scrollParentRef}>
                        {isGridView ? (
                            <div className="Grid">
                                <CompoundsGridContainer
                                    ref={gridViewComponent}
                                    data={data}
                                    retrieveData={retrieveData}
                                    getScrollParent={getScrollParent}
                                    totalDataLength={totalDataLength}
                                    isSimilarityView={isSimilarityView}
                                    accessors={getPermittedAcessors(accessors)}
                                    sort={sort}
                                    updateSort={updateSort}
                                    filterOptions={filterOptions}
                                    filterRanges={filterRanges}
                                    getSearchAndFilterCriteria={getSearchAndFilterCriteria}
                                    updateSearch={updateSearch}
                                    updateFilter={updateFilter}
                                    updateFilterRange={updateFilterRange}
                                    compoundNumberSearchLimit={compoundNumberSearchLimit}
                                />
                            </div>
                        ) : (
                            <CompoundsTableContainer
                                data={data}
                                accessors={getPermittedAcessors(accessors)}
                                retrieveData={retrieveData}
                                sort={sort}
                                updateSort={updateSort}
                                filterOptions={filterOptions}
                                comparisonMethod={getComparison}
                                filterRanges={filterRanges}
                                getSearchAndFilterCriteria={getSearchAndFilterCriteria}
                                updateSearch={updateSearch}
                                updateFilter={updateFilter}
                                updateFilterRange={updateFilterRange}
                                isSimilarityView={isSimilarityView}
                                isLoading={loading}
                                getScrollParent={getScrollParent}
                                totalDataLength={totalDataLength}
                                compoundNumberSearchLimit={compoundNumberSearchLimit}
                            />
                        )}
                    </div>
                </div>
            </Fragment>
        );
}

export default AllCompoundsContainer
