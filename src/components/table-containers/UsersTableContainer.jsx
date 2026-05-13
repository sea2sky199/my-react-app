import React, { Fragment } from 'react'
import {
    InfiniteTable,
    Cell,
    UserEditModal,
    AddUserModal,
    DeleteUserModal,
    FilteringRow,
    CSVExport,
    ClickableDiv,
    ContactUsers
} from '../../components'
import './table-container.css'

import apiService from '../../data/ApiService'
import {
    handleKeyDown,
    toTitleCase,
    snakeToHumanCase,
    stringCompare,
    numericCompare
} from '../../utilities'

import _ from 'lodash'

import { Icon } from 'react-icons-kit'
import { ic_add } from 'react-icons-kit/md/ic_add'
import { ic_edit } from 'react-icons-kit/md/ic_edit'
import { ic_delete } from 'react-icons-kit/md/ic_delete'
import { ic_keyboard_arrow_down } from 'react-icons-kit/md/ic_keyboard_arrow_down'
import { ic_keyboard_arrow_up } from 'react-icons-kit/md/ic_keyboard_arrow_up'

function UsersTableContainer({userInfoStore, title}) {
  const [accessors, setAccessors] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [sort, setSort] = React.useState({ accessor: 'user_id', isAscending: true });
  const [modal, setModal] = React.useState({});
  const [filterMap, setFilterMap] = React.useState({});
  const [searchMap, setSearchMap] = React.useState({});
  const scrollParentRef = React.useRef(null);
  const tableRef = React.useRef(null);

  const filterOptions = {
        role: {
            Administrator: 4,
            'NMA User': 3,
            User: 2,
            Guest: 1
        },
        finance_permission: {
            Yes: 2,
            No: 1
        }
    }

  const accessorsNotIncludedInTable = [
        'id',
        'chemdw_meta',
        'last_chemdw_time',
        'is_deleted',
        'column_config',
        'similarity_column_config'
    ]

  const renderReadableRole = (role) => {
        const roleMap = {
            ADMIN: 'Administrator',
            NMA_USER: 'NMA User',
            USER: 'User',
            GUEST: 'Guest'
        }
        return roleMap[role] || role
    };

  const formatUserDate = (content, userInfo = {}) => {
        if (userInfo.role === 'GUEST' || !content) {
            return '-'
        }
        const date = new Date(content * 1000)
        return date.toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    };

  const formatNameCell = (name, userInfo = {}, isForCSV = false) => {
        if (
            !isForCSV &&
            userInfo['chemdw_meta'] &&
            userInfo['chemdw_meta'].profileid
        ) {
            const chemdw_id = userInfo['chemdw_meta'].profileid
            const chemdw_url = `https://chemdw.web.chemdw.com/culture/displayUserProfile.do?profileId=${chemdw_id}`
            return (
                <a
                    className="username-link semi-bold"
                    href={chemdw_url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {name}
                </a>
            )
        }
        return name
    };

  const openModal = (type, userInfo) => {
        setModal({ type, userInfo })
    };

  const closeModal = (dataChange = false) => {
        setModal({})
        if (dataChange) {
            setData([])
        }
    };

  const renderUserActionsCell = (content, userInfo = {}) => {
        const isSelf = userInfoStore && userInfo.id === userInfoStore.userInfo.id

        const openEditUserModal = () =>
            openModal('editUserModal', userInfo)
        const openDeleteUserModal = () =>
            openModal('deleteUserModal', userInfo)

        return (
            <div className="cell-container flex align-center">
                {!isSelf && (
                    <Fragment>
                        <Icon
                            className="user-change-button pointer align-center justify-center"
                            style={{ display: 'flex' }}
                            icon={ic_edit}
                            size={14}
                            name={`edit-user`}
                            onClick={openEditUserModal}
                            tabIndex={0}
                            onKeyDown={e => handleKeyDown(e, openEditUserModal)}
                        />
                        <Icon
                            className="user-change-button pointer align-center justify-center"
                            style={{ display: 'flex', marginLeft: '0.5rem' }}
                            icon={ic_delete}
                            name={`delete-user`}
                            size={14}
                            onClick={openDeleteUserModal}
                            tabIndex={0}
                            onKeyDown={e =>
                                handleKeyDown(e, openDeleteUserModal)
                            }
                        />
                    </Fragment>
                )}
            </div>
        )
    };

  const headerOrderConfig = [
        {
            accessor: 'user_id',
            comparisonMethod: numericCompare
        },
        {
            accessor: 'name',
            retrieveContent: formatNameCell,
            comparisonMethod: stringCompare
        },
        { accessor: 'email', comparisonMethod: stringCompare },
        {
            accessor: 'role',
            retrieveContent: content => renderReadableRole(content) || '-',
            comparisonMethod: stringCompare
        },
        {
            accessor: 'finance_permission',
            retrieveContent: content => (content ? 'Yes' : 'No'),
            comparisonMethod: numericCompare
        },
        {
            accessor: 'datetime_added',
            retrieveContent: formatUserDate,
            comparisonMethod: numericCompare
        },
        {
            accessor: 'last_access_time',
            retrieveContent: formatUserDate,
            comparisonMethod: numericCompare
        },
        { accessor: 'actions', retrieveContent: renderUserActionsCell }
    ]

  const modalObjectArray = [
        {
            modalType: 'addUserModal',
            renderComponent: () => (
                <AddUserModal
                    closeModal={(change = false) => closeModal(change)}
                />
            )
        },
        {
            modalType: 'editUserModal',
            renderComponent: () => (
                <UserEditModal
                    userInfo={modal.userInfo}
                    closeModal={(change = false) => closeModal(change)}
                />
            )
        },
        {
            modalType: 'deleteUserModal',
            renderComponent: () => (
                <DeleteUserModal
                    userInfo={modal.userInfo}
                    closeModal={(change = false) => closeModal(change)}
                />
            )
        }
    ]

  const renderModal = () => {
        if (modal.type) {
            const activeModalObj = modalObjectArray.find(
                modalObj => modal.type === modalObj.modalType
            )
            if (activeModalObj) {
                return activeModalObj.renderComponent()
            }
        }
    };

  const renderRow = (userInfo, index) => {
        return (
            <tr key={`row-${index}`}>
                {accessors.map((accessor, cellIndex) => {
                    const accessorObj =
                        headerOrderConfig.find(
                            obj => obj.accessor === accessor
                        ) || {}
                    const content = accessorObj.retrieveContent
                        ? accessorObj.retrieveContent(
                              userInfo[accessor],
                              userInfo
                          )
                        : userInfo[accessor] || '-'

                    return (
                        <Cell
                            name={`column_${accessor}`}
                            key={`${index}-${cellIndex}`}
                            cellIndex={cellIndex}
                        >
                            {content}
                        </Cell>
                    )
                })}
            </tr>
        )
    };

  const getUsersTableData = async () => {
        console.log('requesting all users')
        const res = await apiService.get('users')

        if (typeof res !== 'object') {
            throw new Error('Network Error: Please check your connection.')
        }

        const newAccessors = Object.keys(res[0])
            .filter(
                accessor => !accessorsNotIncludedInTable.includes(accessor)
            )
            .sort((a, b) => {
                let aVal = headerOrderConfig.findIndex(
                    obj => obj.accessor === a
                )
                let bVal = headerOrderConfig.findIndex(
                    obj => obj.accessor === b
                )
                return aVal - bVal
            })

        newAccessors.push('actions')

        setAccessors(newAccessors)
        setData(res)
    };

  const getSearchAndFilterCriteria = () => {
        return {
            filterMap: filterMap,
            searchMap: searchMap
        }
    };

  const clearFilters = () => {
        Array.from(document.getElementsByClassName('compounds-search-input'))
            .forEach(node => (node.value = ''))
        setFilterMap({})
        setSearchMap({})
    };

  const updateSearch = _.debounce((value = '', grouping = '') => {
        setSearchMap(prev => ({ ...prev, [grouping]: value }))
    })

  const updateFilter = (filter = '', grouping = '', remove = false) => {
        let groupingFilterArr = filterMap[grouping] || []
        if (!remove) {
            groupingFilterArr.push(filter)
        } else {
            groupingFilterArr = groupingFilterArr.filter(
                filterParameter => filterParameter !== filter
            )
        }
        setFilterMap({
                ...filterMap,
                [grouping]: groupingFilterArr
            })
    };

  const areFiltersApplied = () => {
        for (const accessor in filterMap) {
            if (filterMap[accessor].length) {
                return true
            }
        }
        for (const accessor in searchMap) {
            if (searchMap[accessor]) {
                return true
            }
        }
        return false
    };

  const getUserTable = (allData) => {
        let filteredData = allData.filter(user => {
            for (const grouping in filterMap) {
                const activeFilters = filterMap[grouping]
                if (activeFilters.length) {
                    let displayValue
                    if (grouping === 'role') {
                        displayValue = renderReadableRole(user[grouping])
                    } else if (grouping === 'finance_permission') {
                        displayValue = user[grouping] ? 'Yes' : 'No'
                    } else {
                        displayValue = user[grouping]
                    }
                    if (!activeFilters.includes(displayValue)) return false
                }
            }
            for (const grouping in searchMap) {
                if (searchMap[grouping]) {
                    const value = String(user[grouping] || '').toLowerCase()
                    if (!value.includes(searchMap[grouping].toLowerCase())) return false
                }
            }
            return true
        })

        const sortConfig = headerOrderConfig.find(c => c.accessor === sort.accessor)
        if (sortConfig && sortConfig.comparisonMethod) {
            filteredData = filteredData.sort((a, b) => {
                const result = sortConfig.comparisonMethod(a[sort.accessor], b[sort.accessor])
                return sort.isAscending ? result : -result
            })
        }

        return filteredData.map((user, i) => renderRow(user, i))
    };

  const getCSVHeaders = (allData) => {
        return accessors
            .filter(accessor => accessor !== 'actions')
            .map(accessor => ({
                label: toTitleCase(snakeToHumanCase(accessor)),
                key: accessor
            }))
    };

  const renderHeadingRow = (accs) => {
        return accs.map(accessor => {
            const isSorted = sort.accessor === accessor
            const isAscending = sort.isAscending
            return (
                <th
                    key={accessor}
                    className="heading-cell pointer"
                    onClick={() => setSort({
                        accessor,
                        isAscending: isSorted ? !isAscending : true
                    })}
                >
                    <div className="flex align-center">
                        {toTitleCase(snakeToHumanCase(accessor))}
                        {isSorted && (
                            <Icon
                                icon={isAscending ? ic_keyboard_arrow_up : ic_keyboard_arrow_down}
                                size={14}
                            />
                        )}
                    </div>
                </th>
            )
        })
    };

  const loadUsersDataForCSVExport = () => {
        const formattedData = data.map(userDataObj => {
            const formattedObj = { ...userDataObj }
            for (const accessor in formattedObj) {
                const accessorConfig = headerOrderConfig.find(
                    config => config.accessor === accessor
                )
                if (accessorConfig && accessorConfig.retrieveContent) {
                    formattedObj[accessor] = accessorConfig.retrieveContent(
                        userDataObj[accessor],
                        userDataObj,
                        true
                    )
                }
            }
            return formattedObj
        })
        return { results: formattedData }
    };

  const getScrollParent = () => {
        return scrollParentRef.current
    };

  const view = getUserTable(data)
        return (
            <Fragment>
                {renderModal()}
                <div className="DataTable padding-top-nav-breadcrumb">
                    <div className="TableCaptionBar flex align-center space-between">
                        <div className="TableCaptionBarLeft">
                            <div className="h0 semi-bold">{`${title}`}</div>
                        </div>
                        <div className="flex" style={{ maxWidth: '85%' }}>
                            {areFiltersApplied() && (
                                <div className="TableCaptionBarFilterContainer flex align-center">
                                    <ClickableDiv
                                        classNameArr={[
                                            'reset-filters',
                                            'flex',
                                            'align-center',
                                            'h5'
                                        ]}
                                        clickAction={clearFilters}
                                    >
                                        Reset Filters x
                                    </ClickableDiv>
                                </div>
                            )}
                            <div className="TableCaptionBarButtonContainer flex align-center">
                                <button
                                    className="TableCaptionBarButton h6 pointer flex align-center"
                                    onClick={() =>
                                        openModal('addUserModal')
                                    }
                                >
                                    Add New User
                                    <Icon
                                        icon={ic_add}
                                        size={14}
                                        style={{
                                            paddingLeft: '0.5rem',
                                            marginRight: '-0.25rem',
                                            marginTop: '-1px'
                                        }}
                                    />
                                </button>
                                <ContactUsers users={data} />
                                <CSVExport
                                    exportType="users"
                                    totalDataLength={data.length}
                                    headers={getCSVHeaders(data)}
                                    classNamesArray={[
                                        'TableCaptionBarButton',
                                        'h6',
                                        'pointer',
                                        'flex',
                                        'align-center'
                                    ]}
                                    dataRequest={loadUsersDataForCSVExport}
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className="ScrollContainer"
                        ref={scrollParentRef}
                    >
                        <table className="Table h5" ref={tableRef}>
                            <thead>
                                <tr key="heading">
                                    {renderHeadingRow(accessors)}
                                </tr>
                                <FilteringRow
                                    accessors={accessors}
                                    filterOptions={filterOptions}
                                    updateFilter={updateFilter}
                                    updateSearch={updateSearch}
                                    getSearchAndFilterCriteria={
                                        getSearchAndFilterCriteria
                                    }
                                    filterExemptAccessorsArray={[
                                        'actions',
                                        'datetime_added',
                                        'last_access_time'
                                    ]}
                                    formatTitle={accessor =>
                                        toTitleCase(snakeToHumanCase(accessor))
                                    }
                                />
                            </thead>
                            <InfiniteTable
                                type={'users'}
                                retrieveNewRows={getUsersTableData}
                                getScrollParent={getScrollParent}
                                totalDataLength={
                                    data.length
                                        ? view.length
                                        : undefined
                                }
                                view={view}
                            />
                        </table>
                    </div>
                </div>
            </Fragment>
        );
}

export default UsersTableContainer
