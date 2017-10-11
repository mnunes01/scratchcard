import React from 'react' // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom'
import ErrorPage from '../404.jsx' // eslint-disable-line no-unused-vars
import { HashRouter as Router } from 'react-router-dom' // eslint-disable-line no-unused-vars

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Router><ErrorPage /></Router>, div)
})
