import React from 'react'
import ReactDOM from 'react-dom'

import { ClickableDiv } from '..'

const modalRoot = document.getElementById('modal-root')

function InformationModalShell({popOut, initialPosition, hideInformative, header, children}) {
  const [shift, setShift] = React.useState({
        left: popOut ? initialPosition.left : 0,
        top: popOut ? initialPosition.top : 0
    });
  const informativeModal = React.useRef(null);

  const handleClick = React.useCallback((e) => {
        if (informativeModal.current && !informativeModal.current.contains(e.target)) {
            hideInformative()
        }
    }, [hideInformative]);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClick, false)
    return () => {
      document.removeEventListener('mousedown', handleClick, false)
    };
  }, [handleClick]);

  React.useEffect(() => {
    addShiftAsNeeded()
  }, [popOut, initialPosition]);

  const addShiftAsNeeded = () => {
        const update = { ...shift }
        update.left = getLeftShiftAsNeeded()
        update.top = getTopShiftAsNeeded()

        const isUpdate = !(
            shift.left === update.left &&
            shift.top === update.top
        )
        if (isUpdate) {
            setShift(update)
        }
    };

  const getLeftShiftAsNeeded = () => {
        let leftUpdate = shift.left
        if (informativeModal.current) {
            const viewportRight = window.innerWidth
            const informativeModalRect = informativeModal.current.getBoundingClientRect()
            let leftShift = leftUpdate || -informativeModalRect.width / 2
            const distanceFromRight =
                viewportRight -
                (informativeModalRect.right + (leftUpdate ? 0 : leftShift))
            const distanceFromLeft =
                informativeModalRect.left + (leftUpdate ? 0 : leftShift)

            if (distanceFromRight < 0 && distanceFromLeft < 0) {
                return leftUpdate
            } else if (distanceFromRight < 0) {
                let update = leftShift + distanceFromRight - 10
                if (Math.abs(update) < distanceFromLeft) {
                    leftShift = update
                }
            } else if (distanceFromLeft < 0) {
                leftShift = leftShift - distanceFromLeft + 10
            }

            leftUpdate = leftShift
        }
        return leftUpdate
    };

  const getTopShiftAsNeeded = () => {
        let topUpdate = shift.top
        if (informativeModal.current) {
            const viewportBottom = window.innerHeight
            const informativeModalRect = informativeModal.current.getBoundingClientRect()
            const distanceFromBottom =
                viewportBottom - informativeModalRect.bottom
            const distanceFromTop = informativeModalRect.top

            if (distanceFromBottom < 0 && distanceFromTop < 0) {
                return topUpdate
            } else if (distanceFromBottom < 0) {
                let update = topUpdate + distanceFromBottom - 20
                if (Math.abs(update) < distanceFromTop) {
                    topUpdate = update
                }
            } else if (distanceFromTop < 0) {
                topUpdate = topUpdate - distanceFromTop + 10
            }
        }
        return topUpdate
    };

  const top = () => {
        return popOut
            ? `${shift.top}px`
            : `calc( 100% + 4px + ${shift.top}px )`
    }

  const renderModal = () => {
        return (
            <div
                className="information-modal-container"
                onClick={e => e.stopPropagation()}
                ref={informativeModal}
                style={{
                    top: top(),
                    left: `${shift.left}px`
                }}
            >
                <div>
                    <div className="modal-header flex space-between">
                        <div
                            className="h5-5 baseline-font-weight flex align-center nowrap"
                            style={{ padding: '0.75rem 1rem' }}
                        >
                            {header}
                        </div>
                        <div>
                            <ClickableDiv
                                classNameArr={['modal-close', 'h3']}
                                clickAction={hideInformative}
                            >
                                <span>&times;</span>
                            </ClickableDiv>
                        </div>
                    </div>
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        )
    };

  return popOut
            ? ReactDOM.createPortal(renderModal(), modalRoot)
            : renderModal();
}

export default InformationModalShell
