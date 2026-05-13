import React from 'react'
import AppIcon from '../utility-components/AppIcon'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { ic_settings } from 'react-icons-kit/md/ic_settings'
import { debounce } from 'lodash'

import CheckboxColumnItem from './CheckboxColumnItem'
import { getViewportHeight, hasClass } from '../../utilities'
import apiService from '../../data/ApiService'

function ColumnConfig({isSimilarityView, userId, columnsConfigStore}) {
  const [numberHiddenColumns, setNumberHiddenColumns] = React.useState(null);
  const [configDropdownVisible, setConfigDropdownVisible] = React.useState(false);
  const [hiddenColumnLabelVisible, setHiddenColumnLabelVisible] = React.useState(false);
  const [dropdownHeight, setDropdownHeight] = React.useState(null);
  const button = React.useRef(null);
  const dropdown = React.useRef(null);

  const resizeHandler = () => {
        if (button.current) {
            const dropdownTopEdge = button.current.getBoundingClientRect().bottom
            setDropdownHeight(`calc(${getViewportHeight() - dropdownTopEdge}px - 3.3rem)`)
        }
    };

  const hideDropdown = React.useCallback((e) => {
        if (button.current && !button.current.contains(e.target) &&
            dropdown.current && !dropdown.current.contains(e.target)) {
            setConfigDropdownVisible(false)
        }
    }, []);

  React.useEffect(() => {
    const debouncedResize = debounce(resizeHandler, 100)
        window.addEventListener('resize', debouncedResize)
        document.addEventListener('mousedown', hideDropdown)

        if (numberHiddenColumns) {
            setHiddenColumnLabelVisible(true)
        }

    return () => {
      window.removeEventListener('resize', debouncedResize)
        document.removeEventListener('mousedown', hideDropdown)
    };
  }, [hideDropdown, numberHiddenColumns]);

  const updateSavedColumns = async () => {
        const colName = isSimilarityView ? 'similarity_column_config' : 'column_config'
        await apiService.axiosCall('updateColumnConfig', { id: userId, [colName]: [...columnsConfigStore.columnsConfig.entries()], colName: colName }, '', 'put')
    };

  const debouncedUpdateSavedColumns = React.useRef(debounce(updateSavedColumns, 2000)).current;

  const dropdownHandler = () => {
        resizeHandler()
        setConfigDropdownVisible(prev => !prev)
    };

  const defaultHandler = () => {
        columnsConfigStore.resetDefaults()
        setNumberHiddenColumns(0)
        debouncedUpdateSavedColumns()
    };

  const checkboxHandler = (item) => {
        columnsConfigStore.toggleColumn(item)
        const hidden = [...columnsConfigStore.columnsConfig.values()].filter(v => !v.visible).length
        setNumberHiddenColumns(hidden)
        debouncedUpdateSavedColumns()
    };

  const onDragEnd = ({ destination, source }) => {
        if (!destination) {
            return
        }

        if (destination.index === source.index) {
            return
        }

        columnsConfigStore.reorderColumn(source.index, destination.index)
        debouncedUpdateSavedColumns()
    };

  return (
            <div style={{ position: 'absolute', left: '0' }}>
                <div className="column-config-component">
                    {!!numberHiddenColumns &&
                        hiddenColumnLabelVisible &&
                        !configDropdownVisible && (
                            <div className="column-config-hidden-columns-label h7 nowrap">
                                <i>{`${numberHiddenColumns} ${
                                    numberHiddenColumns > 1
                                        ? 'COLUMNS'
                                        : 'COLUMN'
                                    } HIDDEN`}</i>
                            </div>
                        )}
                    <div
                        className={`column-config pointer ${hasClass([
                            'open',
                            configDropdownVisible
                        ])}`}
                        ref={button}
                        onClick={dropdownHandler}
                        onMouseEnter={() =>
                            setHiddenColumnLabelVisible(true)
                        }
                        onMouseLeave={() =>
                            setHiddenColumnLabelVisible(false)
                        }
                    >
                        <AppIcon icon={ic_settings} />
                    </div>
                    {configDropdownVisible && (
                        <DragDropContext
                            onDragEnd={onDragEnd}
                            className="column-config-drag-container"
                        >
                            <Droppable droppableId="dropdown-config">
                                {(provided, snapshot) => (
                                    <div className="column-config-wrapper pointer-events-none">
                                        <div
                                            className="column-config-dropdown-container pointer-events-initial"
                                            ref={dropdown}
                                        >
                                            <div
                                                className={`config-checkbox-container h5 ${hasClass(
                                                    [
                                                        'dragging',
                                                        snapshot.isUsingPlaceholder
                                                    ]
                                                )}`}
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                style={{
                                                    maxHeight: dropdownHeight
                                                }}
                                            >
                                                <CheckboxColumnItem
                                                    items={
                                                        columnsConfigStore
                                                    }
                                                    update={
                                                        checkboxHandler
                                                    }
                                                ></CheckboxColumnItem>
                                                {provided.placeholder}
                                            </div>
                                            <button
                                                className="column-config-dropdown-reset h6.5"
                                                onClick={defaultHandler}
                                            >
                                                Restore Defaults
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                </div>
            </div>
        );
}

export default ColumnConfig
