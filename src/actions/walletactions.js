/**
* Collection of methods that dispatch actions to the data store
*/

/* imports dispatcher */
import dispatcher from '../dispatcher'

//decrease funds on card purchase
export function decreaseFunds (values) {
  dispatcher.dispatch({
    type: 'DECREASE_FUNDS',
    values: {
      amount: values.amount
    }
  })
}

//increase funds on card prized
export function increaseFunds (values) {
  dispatcher.dispatch({
    type: 'INCREASE_FUNDS',
    values: {
      amount: values.amount
    }
  })
}
