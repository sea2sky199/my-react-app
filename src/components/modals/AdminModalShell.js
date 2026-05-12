import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './modal.css'

import { ClickableDiv } from '..'
import { hasClass } from '../../utilities'

const modalRoot = document.getElementById('modal-root')

function AdminModalShell({closeModal, backdropStyle, header, body, cancelText, isHoldOnSubmission, submitText, submitModal}) {
  const [showing, setShowing] = React.useState(false);
  const [hiding, setHiding] = React.useState(false);
  const [closeEvent, setCloseEvent] = React.useState(null);
  React.useEffect(() => {
    setTimeout(() => {
            setShowing(true)
        }, 100)
  }, []);

  const completeEvent = () => {
        if (hiding) {
            closeModal(closeEvent)
        }
    };

  modalButtonArr = [
        'modal-footer-button',
        'flex',
        'justify-center',
        'align-center',
        'border-right'
    ]

  return ReactDOM.createPortal(
            <div
                className={`backdrop ${hasClass(
                    ['showing', showing],
                    ['hiding', hiding]
                )}`}
                style={{ ...backdropStyle }}
            >
                <div
                    className="modal-container"
                    onAnimationEnd={completeEvent}
                >
                    <div>
                        <div className="modal-header flex space-between">
                            <div className="flex align-center nowrap">
                                {header}
                            </div>
                            <div>
                                <ClickableDiv
                                    classNameArr={['modal-close', 'h3']}
                                    clickAction={willCloseModal}
                                >
                                    <span>&times;</span>
                                </ClickableDiv>
                            </div>
                        </div>
                        <div className="modal-body">{body}</div>
                        <div className="modal-footer flex h5">
                            <ClickableDiv
                                classNameArr={modalButtonArr}
                                clickAction={willCloseModal}
                            >
                                {cancelText || 'Cancel'}
                            </ClickableDiv>
                            {isHoldOnSubmission ? (
                                <div
                                    className={[
                                        ...modalButtonArr,
                                        'modal-footer-button-inactive'
                                    ].join(' ')}
                                >
                                    {submitText || 'Save'}
                                </div>
                            ) : (
                                <ClickableDiv
                                    classNameArr={modalButtonArr}
                                    clickAction={submitModal}
                                    name="submit-modal-button"
                                >
                                    {submitText || 'Save'}
                                </ClickableDiv>
                            )}
                        </div>
                    </div>
                </div>
            </div>,
            modalRoot
        );
}

export default AdminModalShell
