import {EventEmitter} from 'events'
import dispatcher from '../dispatcher'
import LocalForage from 'localforage'
import { DB_NAME, DB_DESCRIPTION, DB_VERSION } from '../config/config.js'

class WalletStore extends EventEmitter {
  constructor () {
    super()
    LocalForage.config(
      {
        name: DB_NAME,
        version: DB_VERSION,
        description: DB_DESCRIPTION
      }
    )
  }

  /**
  * Save new card info to play history
  * executes the provided callback, returning a object with key and values or error on fail
  * @method savePlay
  * @param {object} values - object containing contact details
  * @param {requestCallback} callback - The callback that handles the response.
  */
  savePlay (values, callback) {
    let key = Date.now().toString()
    LocalForage.setItem(key, values)
      .then(function (value) {
        callback(null, {key, value})
      })
      .catch(function (err) {
        callback(err)
      })
  }

  /**
  * Retrieves the entire collection of play history
  * executes the provided callback, returning the collection or error on fail
  * @method getAllHistory
  * @param {requestCallback} callback - The callback that handles the response.
  */
  getAllHistory (callback) {
    let collection = []
    LocalForage.iterate(function (value, key, iterationNumber) {
      collection.push({key, value})
    }).then(function (value) {
      console.log(collection)
      callback(null, collection)
    }).catch(function (err) {
      callback(err)
    })
  }

  /**
  * Decreases the amount of funds available, used when a new card is created
  * @method decreaseFunds
  * @param {object} val - amount to decrease
  */
  decreaseFunds(val){
    this.emit('decreaseFunds', {val})
  }

  /**
  * Increases the amount of funds available, used when the card is prized
  * @method increaseFunds
  * @param {object} val - amount to increase
  */
  increaseFunds(val){
    this.emit('increaseFunds', {val})
  }

  /**
  * action handler routing
  */
  handleActions (action) {
    switch (action.type) {
      case 'DECREASE_FUNDS':
      {
        this.decreaseFunds(action.values) //Decreases the amount of funds available, used when a new card is created
        break
      }
      case 'INCREASE_FUNDS':
      {
        this.increaseFunds(action.values) //Increases the amount of funds available, used when the card is prized
        break
      }
      case 'SAVE_PLAY': // create new play entry on history
      {
        this.savePlay(action.values, action.callback)
        break
      }
      case 'GET_ALL_HISTORY': // gets all the contacts
      {
        this.getAllHistory(action.callback)
        break
      }
      default:
      {
        break
      }
    }
  }
}
const walletStore = new WalletStore()
dispatcher.register(walletStore.handleActions.bind(walletStore))
export default walletStore
