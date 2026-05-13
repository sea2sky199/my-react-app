import React from 'react'

import { AdminModalShell } from '../../components'
import { hasClass, contactEmail } from '../../utilities'
import EmailService from '../../data/EmailService'

function ContactUsersModal({showing, onClose, users}) {
  const [subject, setSubject] = React.useState('');
  const [messageBody, setMessageBody] = React.useState('');
  const [error, setError] = React.useState(false);

  const hideContactUsers = () => {
        setSubject('');
        setMessageBody('');
        setError(false);
        onClose();
    };

  function userNonGuestEmailArray() {
        return users.reduce((nonGuestEmailArray, user) => {
            if (user.role !== 'GUEST') {
                nonGuestEmailArray.push(user.email)
            }
            return nonGuestEmailArray
        }, [])
    }

  const submitMessage = async () => {
        try {
            await EmailService.send(
                userNonGuestEmailArray(),
                subject,
                messageBody
            )
            hideContactUsers()
        } catch (err) {
            setError(true)
        }
    };

  function isSubjectValid() {
        return subject.trim().length > 0
    }

  function isMessageBodyValid() {
        return messageBody.trim().length > 0
    }

  function isFormValid() {
        return isSubjectValid() && isMessageBodyValid()
    }

  const renderBody = () => {
        return (
            <div className="user-modal-body-segment">
                <div
                    className={`h5 ${hasClass([
                        'required',
                        !isSubjectValid()
                    ])}`}
                    style={{ paddingBottom: '0.5rem' }}
                >
                    Subject
                </div>
                <input
                    type="text"
                    className="h5-5 modal-text-input"
                    value={subject}
                    onChange={e => {
                        setSubject(e.target.value);
                        setError(false);
                    }}
                />
                <div className="flex space-between">
                    <div
                        className={`h5 ${hasClass([
                            'required',
                            !isMessageBodyValid()
                        ])}`}
                        style={{ paddingBottom: '0.5rem' }}
                    >
                        Message
                    </div>
                    <div
                        className="h6 semi-thin"
                        style={{ marginTop: '0.25rem' }}
                    >
                        {`${userNonGuestEmailArray().length} Users will recieve this message`}
                    </div>
                </div>
                <textarea
                    className="h5-5 text-area"
                    style={{ maxHeight: '30vh' }}
                    value={messageBody}
                    onChange={e => {
                        setMessageBody(e.target.value);
                        setError(false);
                    }}
                ></textarea>
                {error && (
                    <div className="h7 error">Email Was Unable to Send</div>
                )}
            </div>
        )
    };

  return (
        showing && (
            <AdminModalShell
                header={
                    <div
                        className="h4"
                        style={{
                            color: '#FFFFFF',
                            padding: '1.5rem 20rem 1.5rem 2rem'
                        }}
                    >
                        Contact Users
                    </div>
                }
                body={renderBody()}
                closeModal={hideContactUsers}
                submitModal={submitMessage}
                submitText="Send"
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

export default ContactUsersModal
