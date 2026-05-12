import React, { Fragment } from 'react'

import { ClickableDiv, FeedbackModal, SubmitCompoundModal } from '..'
import './layout.css'

import { Icon } from 'react-icons-kit'
import { ic_add } from 'react-icons-kit/md/ic_add'

function UserDropdown({userInfo, reroute}) {
  const [open, setOpen] = React.useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = React.useState(false);
  const [showSubmitCompound, setShowSubmitCompound] = React.useState(false);

  const userDropdownRef = React.useRef(null);

  const handleClick = React.useCallback((e) => {
        if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
            setOpen(false);
        }
    }, []);

  React.useEffect(() => {
        document.addEventListener('mousedown', handleClick, false)
        return () => {
            document.removeEventListener('mousedown', handleClick, false)
        };
    }, [handleClick]);

  const closeDropdown = () => setOpen(false);
  const toggleDropdown = () => setOpen(prev => !prev);

  const buttonClassNameArr = ['user-links', 'flex', 'align-center'];

  return (
        <Fragment>
            <div
                className="nav-user-container h5 letter-spacing"
                ref={userDropdownRef}
            >
                <ClickableDiv
                    classNameArr={['flex', 'space-evenly', 'align-center']}
                    clickAction={toggleDropdown}
                    style={{ height: '100%', padding: '0 2rem 0 1rem' }}
                >
                    <div
                        className="nav-username nav-clickable"
                        style={open ? { color: '#ffffff' } : {}}
                    >{`${userInfo.name}`}</div>
                    <div
                        className={
                            open
                                ? 'nav-user-dropdown upside-down nav-clickable'
                                : 'nav-user-dropdown nav-clickable'
                        }
                        style={{ marginLeft: '-0.5rem' }}
                    >
                        <span>&#9660;</span>
                    </div>
                </ClickableDiv>
                {open && (
                    <div
                        className="user-dropdown-container"
                        onClick={closeDropdown}
                    >
                        {userInfo.role === 'ADMIN' && (
                            <ClickableDiv
                                classNameArr={buttonClassNameArr}
                                clickAction={() => reroute('/admin')}
                            >
                                Manage Users
                            </ClickableDiv>
                        )}
                        <ClickableDiv
                            classNameArr={buttonClassNameArr}
                            clickAction={() => reroute('/help')}
                        >
                            Help Center
                        </ClickableDiv>
                        <ClickableDiv
                            classNameArr={buttonClassNameArr}
                            clickAction={() => setShowFeedbackModal(true)}
                        >
                            Leave Feedback
                        </ClickableDiv>
                        <ClickableDiv
                            classNameArr={[
                                'user-links',
                                'flex',
                                'align-center'
                            ]}
                            clickAction={() => setShowSubmitCompound(true)}
                        >
                            Submit Compound
                            <Icon
                                icon={ic_add}
                                size={18}
                                style={{
                                    marginTop: '-3px',
                                    marginLeft: '0.75rem'
                                }}
                            />
                        </ClickableDiv>
                    </div>
                )}
            </div>
            <FeedbackModal
                showing={showFeedbackModal}
                onClose={() => setShowFeedbackModal(false)}
                userInfo={userInfo}
            />
            <SubmitCompoundModal
                showing={showSubmitCompound}
                onClose={() => setShowSubmitCompound(false)}
            />
        </Fragment>
    );
}

export default UserDropdown
