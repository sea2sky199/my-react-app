import React from 'react'
import { useLocation } from 'react-router-dom'
import { UsersTableContainer } from '../../components'
import { trackPageView } from '../../utilities'
import './admin.css'

function AdminPage() {
  const location = useLocation()

  React.useEffect(() => {
    trackPageView(location.pathname, 'Compound Match - Admin')
  }, [location.pathname]);

  return <UsersTableContainer title={'Manage Users'} />;
}

export default AdminPage
