import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import Navbar from '../Navbar'

import stores from '../../../stores'

describe('Navbar', () => {
    it('should render correctly with no props', () => {
        const component = shallow(<Navbar.wrappedComponent />)

        expect(component).toMatchSnapshot()
    })

    it('Name should be dynamic based on what is in userInfoStore on initial render', () => {
        stores.userInfoStore.setUserInfo({ name: 'Joe Doe' })

        const component = shallow(
            <Navbar.wrappedComponent userInfoStore={stores.userInfoStore} />
        )

        expect(component.find('div.nav-username').text()).toEqual('Joe Doe')
    })
})
