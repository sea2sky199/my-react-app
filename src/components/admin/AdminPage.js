import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { UsersTableContainer } from '../../components'
import { trackPageView } from '../../utilities'
import './admin.css'

function AdminPage({location}) {
  React.useEffect(() => {
    // matomo tracking
        let currentUrl = location.pathname
        trackPageView(currentUrl, 'Compound Match - Admin')
  }, []);

  return <UsersTableContainer title={'Manage Users'} />;
}

export default withRouter(AdminPage)
