import React, { Component, Fragment } from 'react'

import { createEvent } from '../../utilities'

import InformationModalShell from './InformationModalShell'
import './information.css'

import { Icon } from 'react-icons-kit'
import { ic_info } from 'react-icons-kit/md/ic_info'

function Information({eventName, popOut, buttonStyle, header, children}) {
  const [showing, setShowing] = React.useState(false);
  const [informative, setInformative] = React.useState(this.modalShowEvent);
  const [showInformativeEvent, setShowInformativeEvent] = React.useState(createEvent(this.eventName));
  const [informativeButtonPosition, setInformativeButtonPosition] = React.useState({});
  const informativeButton = React.useRef(null);
  React.useEffect(() => {
    modalShowEvent.addEventListener(
            eventName,
            showInformative
        )
        setInformativeButtonPosition()
    
    return () => {
      modalShowEvent.removeEventListener(
            eventName,
            showInformative
        )
    };
  }, []);

  const setInformativeButtonPosition = () => {
        const currentPosition = informativeButton.current.getBoundingClientRect()
        if (
            informativeButtonPosition.left !==
                currentPosition.left ||
            informativeButtonPosition.top !== currentPosition.top
        )
            setInformativeButtonPosition(currentPosition)
    };

  const showInformative = () => {
        this.setState({ showing: true }, () =>
            setInformativeButtonPosition()
        )
    };

  const hideInformative = () => {
        setShowing(false)
    };

  function popOut() {
        //defaults popOut to true
        return popOut === undefined ? true : popOut
    }

  return (
            <Fragment>
                <div
                    className="pink-secondary information-icon pointer"
                    style={buttonStyle}
                    ref={informativeButton}
                >
                    <Icon
                        id={`${eventName}-icon`}
                        onClick={triggerShowInformative}
                        icon={ic_info}
                        size={16}
                    />
                </div>
                {showing && (
                    <div style={{ position: 'relative', display: 'inline' }}>
                        <InformationModalShell
                            initialPosition={
                                informativeButtonPosition
                            }
                            hideInformative={hideInformative}
                            header={header}
                            popOut={popOut}
                        >
                            <div style={{ backgroundColor: '#fff' }}>
                                {children}
                            </div>
                        </InformationModalShell>
                    </div>
                )}
            </Fragment>
        );
}

export default Information
