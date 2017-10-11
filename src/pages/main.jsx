/**
* Main Router
* Switchs the views and loads componets based on the url path
*/
import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom' // eslint-disable-line no-unused-vars
import ScratchCardController from '../modules/scratchcard/index.jsx'
import HistoryController from '../modules/history/index.jsx'
import ErrorPage from '../modules/error/404.jsx'

export default class Main extends React.Component {
  render () {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={ScratchCardController} />
          <Route exact path='/history/' component={HistoryController} />
          <Route path='/404' component={ErrorPage} />
          <Redirect to='/404' />
        </Switch>
      </div>
    )
  }
}
