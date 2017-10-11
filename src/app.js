import React from 'react'
import { HashRouter as Router } from 'react-router-dom' // eslint-disable-line no-unused-vars
import Store from './datastore/store.js'
import Footer from './modules/footer/footer.jsx' // eslint-disable-line no-unused-vars
import Header from './modules/header/header.jsx' // eslint-disable-line no-unused-vars
import Main from './pages/main.jsx' // eslint-disable-line no-unused-vars
import styles from './app.css' // eslint-disable-line no-unused-vars

export default class App extends React.Component {
  render () {
    return (
      <Router>
        <div>
          <Header />
          <Main />
          <Footer />
        </div>
      </Router>
    )
  }
}
