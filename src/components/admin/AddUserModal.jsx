import React, { Fragment } from 'react'
import './admin.css'

import AdminModalShell from '../modals/AdminModalShell'
import AdminSelect from './AdminSelect'
import AdminCheckbox from './AdminCheckbox'
import apiService from '../../data/ApiService'
import {
    handleKeyDown,
    isInvalidBems,
    getAppSSOInfoValue,
    getAppSSOAccountingDept
} from '../../utilities'

function AddUserModal({closeModal}) {
  const [AppSSO, setAppSSO] = React.useState('');
  const [AppSSOUserInfo, setAppSSOUserInfo] = React.useState({});
  const [selectedRole, setSelectedRole] = React.useState(undefined);
  const [privilegedAccess, setPrivilegedAccess] = React.useState(false);
  const [AppSSORequestError, setAppSSORequestError] = React.useState(false);
  const [addNewUserError, setAddNewUserError] = React.useState('');

  const clearCurrentBems = () => {
        setAppSSO('');
        setAppSSOUserInfo({});
        setSelectedRole(undefined);
        setPrivilegedAccess(false);
        setAppSSORequestError(false);
        setAddNewUserError('');
    };

  const togglePrivilegedAccess = () => {
        setPrivilegedAccess(prev => !prev);
        setAddNewUserError('');
    };

  const selectRole = (role) => {
        setSelectedRole(role);
        setAddNewUserError('');
    };

  const getAppSSOUserInfo = async (bemsId) => {
        if (isInvalidBems(bemsId)) {
            setAppSSORequestError(true);
            return;
        }
        try {
            const userInfo = await apiService.get('WebSSOUserInfo', bemsId);
            if (!userInfo) {
                setAppSSORequestError(true);
            } else {
                setAppSSOUserInfo(userInfo);
                setAppSSORequestError(false);
            }
        } catch (err) {
            setAppSSORequestError(true);
        }
    };

  const submitNewUser = async (AppSSOId) => {
        try {
            const name = `${getAppSSOInfoValue(AppSSOUserInfo, 'firstName')} ${getAppSSOInfoValue(AppSSOUserInfo, 'lastName')}`;
            const email = getAppSSOInfoValue(AppSSOUserInfo, 'emailAddress');
            const privileged_permission = selectedRole !== 'GUEST' ? privilegedAccess : false;
            await apiService.post('createUser', {
                webssoId: AppSSOId,
                role: selectedRole,
                name,
                email,
                privileged_permission,
            });
            closeModal();
        } catch (err) {
            setAddNewUserError(err.message || 'Failed to add user');
        }
    };

  const renderHeader = () => {
        return (
            <div className="h4" style={{ padding: '1rem 0 1rem 2rem' }}>
                Add New User
            </div>
        )
    };

  function privilegedPermissionClassName() {
        const role = selectedRole
        const invalidUserPresent = !AppSSOUserInfo.AppSSOId

        if (role === undefined || invalidUserPresent || role === 'GUEST') {
            return 'form-disabled'
        }

        return ''
    }

  function roleClassName() {
        const invalidUserPresent = !AppSSOUserInfo.AppSSOId

        if (invalidUserPresent) {
            return 'form-disabled'
        }

        return ''
    }

  const renderBody = () => {
        return (
            <Fragment>
                {!AppSSOUserInfo.AppSSOId
                    ? renderBemsInput()
                    : renderUserInfo()}
                <div className="user-modal-body-segment">
                    <AdminSelect
                        title={'Step 2 - Choose Role'}
                        optionsMap={{
                            Guest: 'GUEST',
                            User: 'USER',
                            Administrator: 'ADMIN'
                        }}
                        className={roleClassName()}
                        titleClassNamesArr={['h5', 'bold']}
                        selected={selectedRole}
                        update={selectRole}
                    />
                </div>
                <div className="user-modal-body-segment">
                    <AdminCheckbox
                        className={privilegedPermissionClassName()}
                        header="Step 3 - Privileged Access"
                        label="Privileged Access"
                        checked={selectedRole !== 'GUEST' ? privilegedAccess : false}
                        onChange={togglePrivilegedAccess}
                        inputName="privileged_access_checkbox"
                    />
                </div>
                {addNewUserError && (
                    <div
                        className={'h7 error'}
                        style={{ padding: '0.5rem 2rem' }}
                    >{`Error: ${addNewUserError}`}</div>
                )}
            </Fragment>
        )
    };

  const renderBemsInput = () => {
        return (
            <div className="user-modal-body-segment">
                <div className="h5 bold letter-spacing">
                    Step 1 - Enter BEMS ID
                </div>
                <div style={{ padding: '0.5rem 0' }}>
                    <input
                        className="h5"
                        type="search"
                        name="add-user-AppSSO-input"
                        style={{
                            width: '100%',
                            borderRadius: '2px',
                            border: 'solid 1px #ccc'
                        }}
                        value={AppSSO}
                        onChange={e => {
                            setAppSSO(e.target.value);
                            setAppSSORequestError(false);
                            setAddNewUserError('');
                        }}
                        onKeyDown={e =>
                            handleKeyDown(e, () =>
                                getAppSSOUserInfo(AppSSO)
                            )
                        }
                    />
                    {AppSSORequestError && (
                        <div
                            className="h7 error"
                            style={{ paddingTop: '0.5rem' }}
                        >{`No AppSSO Data Found for BEMS ID: ${AppSSO}`}</div>
                    )}
                </div>
            </div>
        )
    };

  const renderUserInfo = () => {
        return (
            <div className="user-modal-body-segment">
                <div className="flex space-between align-center">
                    <div className="h5 bold letter-spacing">
                        {`Step 1 - BEMS ID ${AppSSO}`}
                    </div>
                    <div
                        className="h7 pointer"
                        style={{ color: '#ea3796' }}
                        onClick={clearCurrentBems}
                    >
                        Change
                    </div>
                </div>
                <div
                    className="h7 semi-thin"
                    style={{ padding: '0.5rem 0', whiteSpace: 'normal' }}
                >
                    {renderAppSSOUserInfo()}
                </div>
            </div>
        )
    };

  const renderAppSSOUserInfo = () => {
        const AppSSOUserInfoMap = {
            Name: `${getAppSSOInfoValue(
                AppSSOUserInfo,
                'firstName'
            )} ${getAppSSOInfoValue(AppSSOUserInfo, 'lastName')}`,
            'U.S. Status': getAppSSOInfoValue(
                AppSSOUserInfo,
                'usPersonStatusString'
            ),
            'Accounting Dept.': getAppSSOAccountingDept(
                AppSSOUserInfo
            ),
            Organization: getAppSSOInfoValue(
                AppSSOUserInfo,
                'businessUnit'
            )
        }

        return Object.keys(AppSSOUserInfoMap).map((title, i) => {
            const classNames = ['add-user-modal-AppSSO-info']
            if (i === 0) {
                classNames.push('semi-bold')
            }
            return (
                <div
                    className={classNames.join(' ')}
                    key={`${title}-${i}`}
                >{`${title}: ${AppSSOUserInfoMap[title]}`}</div>
            )
        })
    };

  const isHoldOnSubmission = !AppSSOUserInfo.AppSSOId || !selectedRole;

  return (
        <AdminModalShell
            header={renderHeader()}
            body={renderBody()}
            submitModal={() =>
                submitNewUser(AppSSOUserInfo.AppSSOId)
            }
            closeModal={closeModal}
            submitText={'Add User'}
            isHoldOnSubmission={isHoldOnSubmission}
        />
    );
}

export default AddUserModal
