import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

import { AdminModalShell, AdminSelect } from '..'
import { hasClass, contactEmail, version, siteName } from '../../utilities'
import EmailService from '../../data/EmailService'

function FeedbackModal({userInfoStore, showFeedbackModalEvent, history, instantiateModalAndEvent}) {
  const [title, setTitle] = React.useState(null);
  const [feedbackType, setFeedbackType] = React.useState(null);
  const [feedbackBody, setFeedbackBody] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [showing, setShowing] = React.useState(null);
  React.useEffect(() => {
    modalShowEvent.addEventListener(
            showFeedbackModalEvent,
            showFeedbackModal
        )
    
    return () => {
      modalShowEvent.removeEventListener(
            showFeedbackModalEvent,
            showFeedbackModal
        )
    };
  }, []);

  const hideFeedbackModal = () => {
        this.setState(defaultState)
    };

  const showFeedbackModal = () => {
        setShowing(true)
    };

  const sendFeedback = () => {
        try {
            const subject =
                title || feedbackType || 'User Feedback'
            await userEmailService.send(
                feedbackRecipientArr,
                subject,
                feedbackBody
            )
            hideFeedbackModal()
        } catch (err) {
            setError(true)
        }
    };

  function feedbackBody() {
        const userInfo = userInfoStore.userInfo
        return `${
            isFeedbackTypePresent
                ? `Feedback Type: ${feedbackType}`
                : ''
        }
        Feedback: ${feedbackBody}
        Version: ${version}
        Path: ${history.location.pathname}
        User: ${userInfo.name}
        User BEMS: ${userInfo.user_id}
        User Role: ${userInfo.role}`
    }

  function isFeedbackTypePresent() {
        return feedbackType !== ''
    }

  function isTitlePresent() {
        return isPresent(title.trim().length)
    }

  function isFeedbackBodyValid() {
        return isPresent(feedbackBody.trim().length)
    }

  function isFormValid() {
        return isFeedbackBodyValid
    }

  const renderBody = () => {
        return (
            <div
                className="user-modal-body-segment h5"
                style={{ color: '#000' }}
            >
                <AdminSelect
                    title="Feedback Type"
                    optionsMap={{
                        'Ask a Question': 'Ask a Question',
                        'Report a Problem': 'Report a Problem',
                        'Share a New Idea': 'Share a New Idea',
                        'Give Praise': 'Give Praise'
                    }}
                    selected={feedbackType}
                    labelClassNamesArr={['h6', 'semi-thin']}
                    labelStyle={{ paddingBottom: '0.3rem' }}
                    update={selection => {
                        this.setState({ feedbackType: selection, error: false })
                    }}
                    style={{ paddingBottom: '0.75rem' }}
                />
                <div style={{ paddingBottom: '0.5rem' }}>Title</div>
                <input
                    type="text"
                    className="h5-5 modal-text-input"
                    value={title}
                    onChange={e =>
                        this.setState({
                            title: e.target.value,
                            error: false
                        })
                    }
                />
                <div
                    className={`${hasClass([
                        'required',
                        !isFeedbackBodyValid
                    ])}`}
                    style={{ paddingBottom: '0.5rem' }}
                >
                    Your Feedback
                </div>
                <textarea
                    className="h5-5 text-area"
                    style={{ maxHeight: '18vh' }}
                    value={feedbackBody}
                    onChange={e =>
                        this.setState({
                            feedbackBody: e.target.value,
                            error: false
                        })
                    }
                ></textarea>
                {error && (
                    <div className="h7 error">Feedback Was Unable to Send</div>
                )}
            </div>
        )
    };

  return (
            showing && (
                <AdminModalShell
                    header={
                        <div
                            className="h4 flex-column"
                            style={{
                                color: '#FFFFFF',
                                padding: '1.5rem 0 1.5rem 2rem'
                            }}
                        >
                            <div className="h3">Leave Feedback</div>
                            <div
                                className="h6-5 semi-thin"
                                style={{ padding: '0.5rem 3rem 0 0' }}
                            >{`Help us improve ${siteName}. Any kind of feedback is highly appreciated.`}</div>
                        </div>
                    }
                    body={renderBody()}
                    closeModal={hideFeedbackModal}
                    submitModal={sendFeedback}
                    submitText="Submit"
                    isHoldOnSubmission={!isFormValid}
                    style={{ overflowY: 'auto' }}
                    containerStyle={{
                        width: '70%',
                        height: '70vh'
                    }}
                />
            )
        );
}

export default withRouter(inject('userInfoStore')(observer(FeedbackModal)))
