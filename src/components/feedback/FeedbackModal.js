import React from 'react'
import { useLocation } from 'react-router-dom'

import { AdminModalShell, AdminSelect } from '..'
import { hasClass, contactEmail, version, siteName } from '../../utilities'
import EmailService from '../../data/EmailService'

function FeedbackModal({showing, onClose, userInfo = {}}) {
  const location = useLocation();

  const [title, setTitle] = React.useState('');
  const [feedbackType, setFeedbackType] = React.useState('');
  const [feedbackBodyText, setFeedbackBodyText] = React.useState('');
  const [error, setError] = React.useState(false);

  const hideFeedbackModal = () => {
        setTitle('');
        setFeedbackType('');
        setFeedbackBodyText('');
        setError(false);
        onClose();
    };

  function isFeedbackTypePresent() {
        return feedbackType !== ''
    }

  function buildFeedbackBody() {
        return `${
            isFeedbackTypePresent()
                ? `Feedback Type: ${feedbackType}`
                : ''
        }
        Feedback: ${feedbackBodyText}
        Version: ${version}
        Path: ${location.pathname}
        User: ${userInfo.name}
        User BEMS: ${userInfo.user_id}
        User Role: ${userInfo.role}`
    }

  const sendFeedback = async () => {
        try {
            const subject = title || feedbackType || 'User Feedback'
            await EmailService.send(
                [contactEmail],
                subject,
                buildFeedbackBody()
            )
            hideFeedbackModal()
        } catch (err) {
            setError(true)
        }
    };

  function isTitlePresent() {
        return title.trim().length > 0
    }

  function isFeedbackBodyValid() {
        return feedbackBodyText.trim().length > 0
    }

  function isFormValid() {
        return isFeedbackBodyValid()
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
                        setFeedbackType(selection);
                        setError(false);
                    }}
                    style={{ paddingBottom: '0.75rem' }}
                />
                <div style={{ paddingBottom: '0.5rem' }}>Title</div>
                <input
                    type="text"
                    className="h5-5 modal-text-input"
                    value={title}
                    onChange={e => {
                        setTitle(e.target.value);
                        setError(false);
                    }}
                />
                <div
                    className={`${hasClass([
                        'required',
                        !isFeedbackBodyValid()
                    ])}`}
                    style={{ paddingBottom: '0.5rem' }}
                >
                    Your Feedback
                </div>
                <textarea
                    className="h5-5 text-area"
                    style={{ maxHeight: '18vh' }}
                    value={feedbackBodyText}
                    onChange={e => {
                        setFeedbackBodyText(e.target.value);
                        setError(false);
                    }}
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
                isHoldOnSubmission={!isFormValid()}
                style={{ overflowY: 'auto' }}
                containerStyle={{
                    width: '70%',
                    height: '70vh'
                }}
            />
        )
    );
}

export default FeedbackModal
