import React, { Component, Fragment } from 'react'

import { ClickableDiv, FeedbackModal, SubmitCompoundModal } from '..'
import { createEvent } from '../../utilities'
import './layout.css'

import { Icon } from 'react-icons-kit'
import { ic_add } from 'react-icons-kit/md/ic_add'

const SHOW_FEEDBACK_MODAL_EVENT_NAME = 'showFeedbackModal'
const SHOW_SUBMIT_PART_EVENT_NAME = 'showSubmitCompound'

function UserDropdown({userInfo, reroute}) {
  const [open, setOpen] = React.useState(null);
  const [feedbackModal, setFeedbackModal] = React.useState(null);
  const [showFeedbackModalEvent, setShowFeedbackModalEvent] = React.useState(null);
  const [submitCompoundModal, setSubmitCompoundModal] = React.useState(null);
  const [showSubmitCompoundEvent, setShowSubmitCompoundEvent] = React.useState(null);
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClick, false)
    
    return () => {
      document.removeEventListener('mousedown', handleClick, false)
    };
  }, []);

  const closeDropdown = () => {
        setOpen(false)
    };

  const toggleDropdown = () => {
        setOpen(!open)
    };

  const triggerShowFeedbackModal = () => {
        if (feedbackModal !== null) {
            feedbackModal.dispatchEvent(
                showFeedbackModalEvent
            )
        }
    };

  const triggerShowSubmitCompound = () => {
        if (submitCompoundModal !== null) {
            submitCompoundModal.dispatchEvent(
                showSubmitCompoundEvent
            )
        }
    };

  buttonClassNameArr = ['user-links', 'flex', 'align-center']

  return (
            <Fragment>
                <div
                    className="nav-user-container h5 letter-spacing"
                    ref={node => (userDropdown = node)}
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
                                    clickAction={() =>
                                        reroute('/admin')
                                    }
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
                                clickAction={triggerShowFeedbackModal}
                            >
                                Leave Feedback
                            </ClickableDiv>
                            <ClickableDiv
                                classNameArr={[
                                    'user-links',
                                    'flex',
                                    'align-center'
                                ]}
                                clickAction={triggerShowSubmitCompound}
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
                    instantiateModalAndEvent={
                        instantiateFeedbackModalAndEvent
                    }
                    showFeedbackModalEvent={SHOW_FEEDBACK_MODAL_EVENT_NAME}
                />
                <SubmitCompoundModal
                    instantiateModalAndEvent={
                        instantiateSubmitCompoundModalAndEvent
                    }
                    showSubmitCompoundEvent={SHOW_SUBMIT_PART_EVENT_NAME}
                />
            </Fragment>
        );
}

export default UserDropdown
