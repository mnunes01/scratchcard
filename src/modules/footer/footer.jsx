/**
* footer view
* gives user output about the enviroment, displaying severall enviroment variables setup on the webpack config
*/
import React from 'react'

export default class Footer extends React.Component {
  render () {
    return (
      <div className='footer'>
        <small>Running application in <b>{process.env.NODE_ENV}</b> mode. <br />@{process.env.AUTHOR_NAME} {process.env.BUILD_DATE} Hello:<a href='mailto:{process.env.CONTACT_DETAILS}' rel='noopener noreferrer' target='_blank'>{process.env.CONTACT_DETAILS}</a></small>
      </div>
    )
  }
}
