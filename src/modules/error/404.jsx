/**
* 404 dummy page presented when the ulr path is not correct
*/

import React from 'react'
import { Link } from 'react-router-dom' // eslint-disable-line no-unused-vars
export default class ErrorPage extends React.Component {
  render () {
    return (
      <div>
        <h1>Wrong path explorer!</h1>
        <h2>You hited the unknow and falled on a blackhole.
          <br />Your journey is over and you reached the end of the App universe as we know it.
          <br />Contacts App may be extended one day
          <br />but for now this is all we have!                    
        </h2>
        <h3>press <Link to='/'>here to go back to home</Link></h3>
      </div>
    )
  }
};
