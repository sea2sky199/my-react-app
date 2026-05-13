import React, { Fragment } from 'react'
import AppIcon from '../utility-components/AppIcon'

import ContactUsersModal from './ContactUsersModal'

import { envelopeO } from 'react-icons-kit/fa/envelopeO'

function ContactUsers({users}) {
  const [showing, setShowing] = React.useState(false);

  return (
        <Fragment>
            <button
                className="TableCaptionBarButton h6 pointer flex align-center"
                onClick={() => setShowing(true)}
            >
                Contact Users
                <AppIcon
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
                showing={showing}
                onClose={() => setShowing(false)}
            />
        </Fragment>
    );
}

export default ContactUsers
