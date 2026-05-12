import React, { Fragment, Component } from 'react'
import './admin.css'

import { AdminModalShell } from '..'
import {
    getAppSSOInfoValueFromUserInfo,
    getAppSSOAccountingDeptFromUserInfo
} from '../../utilities'
import apiService from '../../data/ApiService'
import AdminSelect from './AdminSelect'
import AdminCheckbox from './AdminCheckbox'

function UserEditModal({userInfo, closeModal}) {
  const [isPending, setIsPending] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState(this.userInfo.role || null);
  const [isPrivilegedPermissionEnabled, setIsPrivilegedPermissionEnabled] = React.useState(!!this.userInfo
                .privileged_permission);
  const [error, setError] = React.useState(false);

  const togglePrivilegedPermission = () => {
        this.setState({
            isPrivilegedPermissionEnabled: !isPrivilegedPermissionEnabled,
            error: false
        })
    };

  const updateUser = () => {
        const selectedRole = selectedRole
        const isPrivilegedPermissionEnabled = isPrivilegedPermissionEnabled

        if (
            userInfo.role === selectedRole &&
            !!userInfo.privileged_permission ===
                isPrivilegedPermissionEnabled
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
            this.setState({ isPending: false, error: false })
            closeModal(true)
        } catch (err) {
            this.setState({ isPending: false, error: true })
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

  function isPrivilegedPermissionEnabled() {
        return selectedRole !== 'GUEST'
            ? isPrivilegedPermissionEnabled
            : false
    }

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
                                checked={isPrivilegedPermissionEnabled}
                                className={privilegedPermissionClassName}
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
                    !!userInfo.privileged_permission ===
                        isPrivilegedPermissionEnabled
                }
            />
        );
}

export default UserEditModal
