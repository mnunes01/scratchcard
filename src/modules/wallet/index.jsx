/*
* Wallet module, responsible for keeping track and displaying the funds amount
*/
import React from 'react'
import ReactDOM from "react-dom"
import WalletStore from '../../datastore/store.js'
import * as Labels from './config/labels.js'
import * as Configs from '../../config/config.js'

export default class WalletController extends React.Component {
  constructor () {
    super()
    this.state = {
      funds: Configs._INITIAL_FUNDS_AMOUNT
    }
    this.decreaseFundsHandler = this.decreaseFunds.bind(this)
    this.increaseFundsHandler = this.increaseFunds.bind(this)
  }
  componentWillMount () {
    // bind listeners
    WalletStore.on('decreaseFunds', this.decreaseFundsHandler)
    WalletStore.on('increaseFunds', this.increaseFundsHandler)
  }
  // unbind listeners to prevent memory leaks
  componentWillUnmount () {
    WalletStore.removeListener('decreaseFunds', this.decreaseFundsHandler)
    WalletStore.removeListener('increaseFunds', this.increaseFundsHandler)
  }

  /**
  * decrease funds amount
  * @method decreaseFunds
  * @param {object} data - object containing the amount to decrease
  */
  decreaseFunds(data){
    this.setState({
      funds: this.state.funds - data.val.amount
    })
  }

  /**
  * increaseFunds funds amount
  * @method decreaseFunds
  * @param {object} data - object containing the amount to increase
  */
  increaseFunds(data){
    this.setState({
      funds: this.state.funds + data.val.amount
    })
  }

  render () {
    return (
      <div className='walletContainer'>
        <span>{Labels._FUNDS_LABEL}: {this.state.funds}</span>
      </div>
    )
  }
}
