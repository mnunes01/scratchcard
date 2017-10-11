/**
* header view
* enables navigation across the app
* displays the wallet module
*/

import React from 'react'
import { NavLink } from 'react-router-dom' // eslint-disable-line no-unused-vars
import WalletController from '../wallet/index.jsx'

export default class Header extends React.Component {
  render () {
    return (
      <div className='headerLinks'>
        <NavLink exact activeClassName='active' to={'/'} > Home</NavLink>
        <WalletController></WalletController>
        <NavLink activeClassName='active' to={'/history/'}> history</NavLink>
      </div>
    )
  }
}
