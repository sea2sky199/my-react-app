import React from 'react'
import './admin.css'

import { AdminModalShell } from '..'
import apiService from '../../data/ApiService'
import { getChemdwInfoValueFromUserInfo } from '../../utilities'

function DeleteUserModal({userInfo, closeModal}) {
  const [isPending, setIsPending] = React.useState(false);
  const [error, setError] = React.useState(false);

  const deleteUser = async () => {
        try {
            setIsPending(true)
            console.log(`Deleting userId:${userInfo.id}`)
            await apiService.axiosCall(
                'user/',
                {},
                userInfo.id,
                'delete'
            )
            setIsPending(false)
            setError(false)
            closeModal(true)
        } catch (err) {
            setIsPending(false)
            setError(true)
            console.log('Unable to delete user', err)
        }
    };

  const renderChemdwUserInfo = () => {
        const chemdwUserInfoMap = {
            Organization: getChemdwInfoValueFromUserInfo(
                userInfo,
                'businessUnit'
            )
        }

        return Object.keys(chemdwUserInfoMap).map((title, i) => {
            return (
                <div
                    key={`${title}-${i}`}
                >{`${title}: ${chemdwUserInfoMap[title]}`}</div>
            )
        })
    };

  const renderHeader = () => {
        return (
            <div style={{ padding: '1rem 0 1rem 2rem' }}>
                <div className="h7 semi-bold letter-spacing-large">
                    DELETE CONFIRMATION
                </div>
                <div className="h4" style={{ padding: '0.25rem 0' }}>
                    {userInfo.name}
                </div>
                <div className="h7 letter-spacing semi-thin">
                    <div>{`BEMS ID ${userInfo.user_id}`}</div>
                    {renderChemdwUserInfo()}
                </div>
            </div>
        )
    };

  return (
            <AdminModalShell
                header={renderHeader()}
                body={
                    <div
                        className="h5 semi-thin"
                        style={{ padding: '1rem 2rem', whiteSpace: 'normal' }}
                    >
                        Are you sure you want to delete this user? This cannot
                        be undone.
                    </div>
                }
                submitText={'YES - DELETE'}
                cancelText={'NO - CANCEL'}
                submitModal={deleteUser}
                closeModal={closeModal}
            />
        );
}

export default DeleteUserModal
