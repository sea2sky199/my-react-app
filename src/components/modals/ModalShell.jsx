import React from 'react'
import ReactDOM from 'react-dom'
import './modal.css'

import Spinner from '../loading-and-error-views/Spinner'
import ClickableDiv from '../utility-components/ClickableDiv'
import { hasClass } from '../../utilities'

const modalRoot = document.getElementById('modal-root')

function ModalShell({closeModal, backdropStyle, containerStyle, headerStyle, header, style, isLoading, errorMessage, body}) {
  const [showing, setShowing] = React.useState(false);
  const [hiding, setHiding] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => {
            setShowing(true)
        }, 100)
  }, []);

  const willCloseModal = () => {
        setHiding(true)
    };

  const completeEvent = () => {
        if (hiding) {
            closeModal()
        }
    };

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
                    style={{ ...containerStyle }}
                >
                    <div className="flex-column" style={{ height: '100%' }}>
                        <div
                            className="modal-header flex space-between"
                            style={headerStyle}
                        >
                            <div className="flex align-center nowrap">
                                {header}
                            </div>
                            <div>
                                <ClickableDiv
                                    classNameArr={['modal-close', 'h1']}
                                    style={{ backgroundColor: '#e18db6' }}
                                    clickAction={willCloseModal}
                                >
                                    <span>&times;</span>
                                </ClickableDiv>
                            </div>
                        </div>
                        <div
                            className="modal-body"
                            style={{
                                flexGrow: '1',
                                maxHeight: '60vh',
                                ...style
                            }}
                        >
                            {isLoading ? (
                                <div
                                    className="flex-column justify-center"
                                    style={{ height: '100%' }}
                                >
                                    <Spinner size={80} />
                                </div>
                            ) : errorMessage ? (
                                <div
                                    className="flex-column justify-center align-center"
                                    style={{ height: '100%' }}
                                >
                                    {errorMessage}
                                </div>
                            ) : (
                                body
                            )}
                        </div>
                    </div>
                </div>
            </div>,
            modalRoot
        );
}

export default ModalShell
