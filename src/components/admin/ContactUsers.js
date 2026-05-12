import React, { Component, Fragment } from 'react'

import ContactUsersModal from './ContactUsersModal'
import { createEvent } from '../../utilities'

import { Icon } from 'react-icons-kit'
import { envelopeO } from 'react-icons-kit/fa/envelopeO'

const SHOW_CONTACT_USERS_EVENT_NAME = 'showContactUsers'

function ContactUsers({users}) {
  const [contactUsersModal, setContactUsersModal] = React.useState(null);
  const [showContactUsersEvent, setShowContactUsersEvent] = React.useState(null);

  const triggerShowContactUsers = () => {
        if (contactUsersModal !== null) {
            contactUsersModal.dispatchEvent(
                showContactUsersEvent
            )
        }
    };

  return (
            <Fragment>
                <button
                    className="TableCaptionBarButton h6 pointer flex align-center"
                    onClick={triggerShowContactUsers}
                >
                    Contact Users
                    <Icon
                        icon={envelopeO}
                        size={13}
                        style={{
                            paddingLeft: '0.35rem',
                            margin: '-2px -3px 0 0'
                        }}
                    />
                </button>
                <ContactUsersModal
                    users={users}
                    showContactUsers={showContactUsers}
                    showContactUsersEvent={SHOW_CONTACT_USERS_EVENT_NAME}
                />
            </Fragment>
        );
}

export default ContactUsers
