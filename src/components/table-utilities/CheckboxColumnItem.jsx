import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { Icon } from 'react-icons-kit'
import { ic_more_vert } from 'react-icons-kit/md/ic_more_vert'

import { toTitleCase, titleCaseExemptValues, hasClass } from '../../utilities'

const CheckboxColumnItem = ({ items, update }) => {
    return Array.from(items.columnsConfig.keys()).map((name, i) => {
        const dragIconStyle = { color: '#999999', fontSize: '1.5rem', padding: '0.3rem 0 0.7rem' }
        const updateColumnHandler = () => {
            update(name)
        }

        if (!items.columnsConfig.get(name).editable) {
            dragIconStyle['visibility'] = 'hidden'

            return (
                <div
                    className="checkbox-container column-item-container"
                    key={`${i}-column-item-container`}
                    style={{backgroundColor: '#ffffff'}}
                >
                    <Icon icon={ic_more_vert} style={dragIconStyle} />
                    <label
                        htmlFor={name}
                        className='flex align-center disabled'
                    >
                        <input
                            className="checkbox"
                            type="checkbox"
                            name={name}
                            id={name}
                            onChange={updateColumnHandler}
                            checked={items.columnsConfig.get(name).visible}
                        />
                        <div
                            className="checkbox-label column-label"
                            style={{minWidth: '10rem'}}
                        >
                            {toTitleCase(
                                items.columnsConfig.get(name).title.toUpperCase(),
                                titleCaseExemptValues
                            )}
                        </div>
                    </label>
                </div>
            )
        }
        return (
            <Draggable
                draggableId={`${name}-drag-item`}
                index={i}
                key={`${name}-column-item-container`}
            >
                {(provided, snapshot) => (
                    <div
                        className={`checkbox-container column-item-container ${hasClass(
                            ['dragging', snapshot.isDragging], 
                            ['outside', snapshot.draggingOver === null]
                        )}`}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                    >
                        <div
                            style={dragIconStyle}
                            {...provided.dragHandleProps}
                        >
                            <Icon 
                                icon={ic_more_vert}
                                style={{pointerEvents: 'none'}}
                            />
                        </div>
                        <label
                            htmlFor={name}
                            className='flex align-center'
                        >
                            <input
                                className="checkbox"
                                type="checkbox"
                                name={name}
                                id={name}
                                onChange={updateColumnHandler}
                                checked={items.columnsConfig.get(name).visible}
                            />
                            <div
                                className="checkbox-label column-label"
                                style={{minWidth: '10rem'}}
                            >
                                {toTitleCase(
                                    items.columnsConfig.get(name).title.toUpperCase(),
                                    titleCaseExemptValues
                                )}
                            </div>
                        </label>
                    </div>
                )}
            </Draggable>
        )
    })
}

export default CheckboxColumnItem
