/**
* Collection of methods that dispatch actions to the data store
*/

/* imports dispatcher */
import dispatcher from '../dispatcher'


/**
* Create a new play entry on history
* @method ActionSavePlay
* @param {object} values - object containing play details
* @param {requestCallback} callback - The callback that handles the response.
*/
export function ActionSavePlay (values, callback) {
  dispatcher.dispatch({
    type: 'SAVE_PLAY',
    callback: callback,
    values: {
      winnerSymbol: values.winnerSymbol,
      winingCard: values.winingCard,
      winingPositions: values.winingPositions,
      cardInfo: values.cardInfo
    }
  })
}

/**
* Retrieves the entire collection of play history from database
* @method ActionGetAllHistory
* @param {requestCallback} callback - The callback that handles the response.
*/
export function ActionGetAllHistory (callback) {
  dispatcher.dispatch({
    type: 'GET_ALL_HISTORY',
    callback: callback
  })
}
