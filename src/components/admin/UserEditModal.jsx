import React, { Fragment } from 'react'
import './admin.css'

import AdminModalShell from '../modals/AdminModalShell'
import {
    getAppSSOInfoValueFromUserInfo,
    getAppSSOAccountingDeptFromUserInfo
} from '../../utilities'
import apiService from '../../data/ApiService'
import AdminSelect from './AdminSelect'
import AdminCheckbox from './AdminCheckbox'

function UserEditModal({userInfo, closeModal}) {
  const [isPending, setIsPending] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState(userInfo.role || null);
  const [isPrivilegedPermissionEnabled, setIsPrivilegedPermissionEnabled] = React.useState(!!userInfo.privileged_permission);
  const [error, setError] = React.useState(false);

  const selectRole = (role) => {
        setSelectedRole(role);
        setError(false);
    };

  const togglePrivilegedPermission = () => {
        setIsPrivilegedPermissionEnabled(prev => !prev);
        setError(false);
    };

  const updateUser = async () => {
        if (
            userInfo.role === selectedRole &&
            !!userInfo.privileged_permission === isPrivilegedPermissionEnabled
        ) {
            return
        }

        setIsPending(true)
        try {
            console.log(
                `Updating userId:${userInfo.id} to role:${selectedRole} and Privileged Permission:${isPrivilegedPermissionEnabled}`
            )
            await apiService.axiosCall(
                'updateUser/',
                {
                    role: selectedRole,
                    privileged_permission: isPrivilegedPermissionEnabled
                },
                userInfo.id,
                'put'
            )
            setIsPending(false)
            setError(false)
            closeModal(true)
        } catch (err) {
            setIsPending(false)
            setError(true)
            console.log('Unable to update user', err)
        }
    };

  const renderAppSSOUserInfo = () => {
        const chemdwUserInfoMap = {
            Organization: getAppSSOInfoValueFromUserInfo(
                userInfo,
                'businessUnit'
            ),
            'Accounting Dept.': getAppSSOAccountingDeptFromUserInfo(
                userInfo
            ),
            'U.S. Status': getAppSSOInfoValueFromUserInfo(
                userInfo,
                'usPersonStatusString'
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
                    EDIT USER
                </div>
                <div className="h4" style={{ padding: '0.25rem 0' }}>
                    {userInfo.name}
                </div>
                <div className="h7 letter-spacing semi-thin">
                    <div>{`BEMS ID ${userInfo.user_id}`}</div>
                    {renderAppSSOUserInfo()}
                </div>
            </div>
        )
    };

  function privilegedPermissionClassName() {
        if (selectedRole === 'GUEST') {
            return 'form-disabled'
        }

        return ''
    }

  const effectivePrivilegedPermission = selectedRole !== 'GUEST'
        ? isPrivilegedPermissionEnabled
        : false;

  if (!userInfo.name) {
        return null
    }

  return (
        <AdminModalShell
            header={renderHeader()}
            body={
                <Fragment>
                    <div className="user-modal-body-segment">
                        <AdminSelect
                            title={'Role'}
                            optionsMap={{
                                Guest: 'GUEST',
                                User: 'USER',
                                Administrator: 'ADMIN'
                            }}
                            selected={selectedRole}
                            update={selectRole}
                        />
                    </div>
                    <div className="user-modal-body-segment">
                        <AdminCheckbox
                            header="Privileged Access"
                            label="Privileged Access"
                            checked={effectivePrivilegedPermission}
                            className={privilegedPermissionClassName()}
                            onChange={togglePrivilegedPermission}
                            inputName="privileged_access_checkbox"
                        />
                    </div>
                    {error && (
                        <div
                            className="error h7"
                            style={{ padding: '0.5rem 2rem' }}
                        >
                            Error: Unable to Update User
                        </div>
                    )}
                </Fragment>
            }
            submitModal={() => updateUser()}
            closeModal={closeModal}
            isHoldOnSubmission={
                userInfo.role === selectedRole &&
                !!userInfo.privileged_permission === effectivePrivilegedPermission
            }
        />
    );
}

export default UserEditModal
