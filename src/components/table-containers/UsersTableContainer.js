import React, { Fragment, Component } from 'react'
import { observer, inject } from 'mobx-react'
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

import moment from 'moment'
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

  filterOptions = {
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

  modalObjectArray = [
        {
            modalType: 'addUserModal',
            renderComponent: () => (
                <AddUserModal
                    closeModal={(change = false) => this.closeModal(change)}
                />
            )
        },
        {
            modalType: 'editUserModal',
            renderComponent: () => (
                <UserEditModal
                    userInfo={modal.userInfo}
                    closeModal={(change = false) => this.closeModal(change)}
                />
            )
        },
        {
            modalType: 'deleteUserModal',
            renderComponent: () => (
                <DeleteUserModal
                    userInfo={modal.userInfo}
                    closeModal={(change = false) => this.closeModal(change)}
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

  const openModal = (type, userInfo) => {
        const newState = {
            modal: { type, userInfo }
        }
        this.setState(newState)
    };

  const closeModal = (dataChange = false) => {
        const newState = {
            modal: {}
        }
        if (dataChange) {
            newState.data = []
        }
        this.setState(newState)
    };

  const renderRow = (userInfo, index) => {
        return (
            <tr key={`row-${index}`}>
                {accessors.map((accessor, cellIndex) => {
                    const accessorObj =
                        headerOrderConfig.find(
                            accessorObj => accessorObj.accessor === accessor
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

  const renderUserActionsCell = (content, userInfo = {}) => {
        const isSelf = userInfo.id === userInfoStore.userInfo.id

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
                            style={{ display: 'flex' }} //inline style to override icon styles
                            icon={ic_edit}
                            size={14}
                            name={`edit-user`}
                            onClick={openEditUserModal}
                            tabIndex={0}
                            onKeyDown={e => handleKeyDown(e, openEditUserModal)}
                        />
                        <Icon
                            className="user-change-button pointer align-center justify-center"
                            style={{ display: 'flex', marginLeft: '0.5rem' }} //inline style to override icon styles
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

  const formatUserDate = (content, userInfo = {}) => {
        if (userInfo.role === 'GUEST' || !content) {
            return '-'
        }
        return moment.unix(content).format('M/D/YY, h:mm A')
    };

  headerOrderConfig = [
        {
            accessor: 'user_id',
            comparisonMethod: numericCompare
        },
        {
            accessor: 'name',
            retrieveContent: this.formatNameCell,
            comparisonMethod: stringCompare
        },
        { accessor: 'email', comparisonMethod: stringCompare },
        {
            accessor: 'role',
            retrieveContent: content => this.renderReadableRole(content) || '-',
            comparisonMethod: stringCompare
        },
        {
            accessor: 'finance_permission',
            retrieveContent: content => (content ? 'Yes' : 'No'),
            comparisonMethod: numericCompare
        },
        {
            accessor: 'datetime_added',
            retrieveContent: this.formatUserDate,
            comparisonMethod: numericCompare
        },
        {
            accessor: 'last_access_time',
            retrieveContent: this.formatUserDate,
            comparisonMethod: numericCompare
        },
        { accessor: 'actions', retrieveContent: this.renderUserActionsCell }
    ]

  accessorsNotIncludedInTable = [
        'id',
        'chemdw_meta',
        'last_chemdw_time',
        'is_deleted',
        'column_config',
        'similarity_column_config'
    ]

  const getUsersTableData = () => {
        console.log('requesting all users')
        const res = await apiService.get('users')

        if (typeof res !== 'object') {
            throw new Error('Network Error: Please check your connection.')
        }

        const accessors = Object.keys(res[0])
            .filter(
                accessor => !accessorsNotIncludedInTable.includes(accessor)
            )
            .sort((a, b) => {
                let aVal = headerOrderConfig.findIndex(
                    accessorObj => accessorObj.accessor === a
                )
                let bVal = headerOrderConfig.findIndex(
                    accessorObj => accessorObj.accessor === b
                )
                return aVal - bVal
            })

        accessors.push('actions')

        this.setState({
            accessors: accessors,
            data: res
        })
    };

  const getSearchAndFilterCriteria = () => {
        return {
            filterMap: filterMap,
            searchMap: searchMap
        }
    };

  const clearFilters = () => {
        document
            .getElementsByClassName('compounds-search-input')
            .forEach(node => (node.value = ''))

        this.setState({ filterMap: {}, searchMap: {} })
    };

  updateSearch = _.debounce((value = '', grouping = '') => {
        this.setState({
            searchMap: { ...searchMap, [grouping]: value }
        })
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
        return scrollParentRef
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
                                    headers={getCSVHeaders(
                                        data
                                    )}
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
                        ref={ref => (scrollParentRef = ref)}
                    >
                        <table className="Table h5" ref={tableRef}>
                            <thead>
                                <tr key="heading">
                                    {renderHeadingRow(
                                        accessors
                                    )}
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

export default inject('userInfoStore')(observer(UsersTableContainer))
