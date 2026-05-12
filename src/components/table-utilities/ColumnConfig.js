import React, { Component } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { ic_settings } from 'react-icons-kit/md/ic_settings'
import { Icon } from 'react-icons-kit'
import { debounce } from 'lodash'

import { CheckboxColumnItem } from '..'
import { getViewportHeight, hasClass } from '../../utilities'
import apiService from '../../data/ApiService'

function ColumnConfig({isSimilarityView, userId, columnsConfigStore}) {
  const [numberHiddenColumns, setNumberHiddenColumns] = React.useState(null);
  const [configDropdownVisible, setConfigDropdownVisible] = React.useState(null);
  const [hiddenColumnLabelVisible, setHiddenColumnLabelVisible] = React.useState(null);
  const [dropdownHeight, setDropdownHeight] = React.useState(null);
  const button = React.useRef(null);
  const dropdown = React.useRef(null);
  React.useEffect(() => {
    let debouncedResize;
    debouncedResize = debounce(resizeHandler, 100)
        window.addEventListener('resize', debouncedResize)
        document.addEventListener('mousedown', hideDropdown)

        if (numberHiddenColumns) {
            setHiddenColumnLabelVisible(true)
        }
    
    return () => {
      window.removeEventListener('resize', debouncedResize)
        document.removeEventListener('mousedown', hideDropdown)
    };
  }, []);

  const dropdownHandler = () => {
        resizeHandler()
        setConfigDropdownVisible(!configDropdownVisible)
    };

  const resizeHandler = () => {
        const dropdownTopEdge = button.current.getBoundingClientRect()
            .bottom
        setDropdownHeight(`calc(${getViewportHeight() -
                dropdownTopEdge}px - 3.3rem)`)
    };

  const defaultHandler = () => {
        columnsConfigStore.resetDefaults()
        setNumberHiddenColumns(0)
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

  const updateSavedColumns = () => {
        const colName = isSimilarityView ? 'similarity_column_config' : 'column_config'
        await apiService.axiosCall('updateColumnConfig', { id: userId, [colName]: [...columnsConfigStore.columnsConfig.entries()], colName: colName }, '', 'put')
    };

  debouncedUpdateSavedColumns = debounce(this.updateSavedColumns, 2000)

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
                        <Icon icon={ic_settings} />
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
