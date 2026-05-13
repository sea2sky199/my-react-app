const getChemdwInfoValueFromUserInfo = (userInfo, key) => {
    return isChemdwDataPresent(userInfo)
        ? getChemdwInfoValue(userInfo['chemdw_meta'].user, key)
        : 'None Specified'
}

const isChemdwDataPresent = userInfo => {
    return (
        !!userInfo &&
        !!userInfo['chemdw_meta'] &&
        !!userInfo['chemdw_meta'].user
    )
}

const getChemdwInfoValue = (chemdwData, key) => {
    return isChemdwKeyPresent(chemdwData, key)
        ? chemdwData[key]
        : 'None Specified'
}

const isChemdwKeyPresent = (chemdwData, key) => {
    return !!chemdwData && !!chemdwData[key]
}

const getChemdwAccountingDeptFromUserInfo = userInfo => {
    return isChemdwDataPresent(userInfo)
        ? getChemdwAccountingDept(userInfo['chemdw_meta'].user)
        : 'None Specified'
}

const getChemdwAccountingDept = chemdwData => {
    return isChemdwKeyPresent(chemdwData, 'accountingDeptNumber') &&
        isChemdwKeyPresent(chemdwData, 'accountingDeptName')
        ? `${getChemdwInfoValue(
              chemdwData,
              'accountingDeptName'
          )} (${getChemdwInfoValue(chemdwData, 'accountingDeptNumber')})`
        : 'None Specified'
}

export {
    getChemdwInfoValueFromUserInfo,
    getChemdwAccountingDeptFromUserInfo,
    getChemdwInfoValue,
    getChemdwAccountingDept
}

export const getAppSSOAccountingDept = getChemdwAccountingDept
export const getAppSSOAccountingDeptFromUserInfo = getChemdwAccountingDeptFromUserInfo
export const getAppSSOInfoValue = getChemdwInfoValue
export const getAppSSOInfoValueFromUserInfo = getChemdwInfoValueFromUserInfo
export const getAppSSOUserInfo = userInfo => (userInfo && userInfo['chemdw_meta'] && userInfo['chemdw_meta'].user) || {}
