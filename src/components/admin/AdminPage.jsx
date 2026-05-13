import React from 'react'
import { useLocation } from 'react-router-dom'
import UsersTableContainer from '../table-containers/UsersTableContainer'
import { trackPageView } from '../../utilities'
import './admin.css'

function AdminPage({ userInfoStore }) {
  const location = useLocation()

  React.useEffect(() => {
    trackPageView(location.pathname, 'Compound Match - Admin')
  }, [location.pathname]);

  return <UsersTableContainer title={'Manage Users'} userInfoStore={userInfoStore} />;
}

export default AdminPage
