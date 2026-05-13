import React, { Fragment } from 'react'

import InformationModalShell from './InformationModalShell'
import './information.css'

import { Icon } from 'react-icons-kit'
import { ic_info } from 'react-icons-kit/md/ic_info'

function Information({popOut, buttonStyle, header, children}) {
  const [showing, setShowing] = React.useState(false);
  const [informativeButtonPosition, setInformativeButtonPosition] = React.useState({});
  const informativeButton = React.useRef(null);

  const isPopOut = popOut === undefined ? true : popOut

  const showInformative = () => {
        if (informativeButton.current) {
            const currentPosition = informativeButton.current.getBoundingClientRect()
            setInformativeButtonPosition(currentPosition)
        }
        setShowing(true)
    };

  const hideInformative = () => {
        setShowing(false)
    };

  return (
            <Fragment>
                <div
                    className="pink-secondary information-icon pointer"
                    style={buttonStyle}
                    ref={informativeButton}
                >
                    <Icon
                        onClick={showInformative}
                        icon={ic_info}
                        size={16}
                    />
                </div>
                {showing && (
                    <div style={{ position: 'relative', display: 'inline' }}>
                        <InformationModalShell
                            initialPosition={informativeButtonPosition}
                            hideInformative={hideInformative}
                            header={header}
                            popOut={isPopOut}
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
