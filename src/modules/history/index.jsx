import React from 'react'
import ReactDOM from "react-dom"
import CreateJs from 'yuki-createjs'

import cardGenerator from '../scratchcard/cardgenerator.js'
import * as HistoryActions from '../../actions/historyActions'
import * as Labels from './config/labels.js'
import * as Configs from '../../config/config.js'
import Select from 'react-select'; // eslint-disable-line no-unused-vars

export default class HistoryController extends React.Component {
  constructor () {
    super()
    this.state = {
      playHistory: [],
      outputMessage: '',
      bitmap: undefined,
      cardData: undefined
    }
    this.renderPlayHandler = this.renderPlay.bind(this)
  }

  componentDidMount () {
    this.setState({outputMessage: Labels._LOADING_})
    HistoryActions.ActionGetAllHistory((err, data) => {
      if (err) {
        console.log(err)
      } else {
        if (data.length === 0) {
          this.setState({outputMessage: Labels._NO_CONTACTS_})
        } else {
          this.setState({playHistory: data, outputMessage: Labels._LOADED_})
        }
      }
    })
  }
  renderPlay (val) {
    var card = new cardGenerator(
      Configs._WIDTH,
      Configs._HEIGHT,
      Configs._CIRCLE_SYMBOL_COLOR,
      Configs._CROSS_SYMBOL_COLOR,
      Configs._WINING_HIGHLIGTH_COLOR,
      Configs._BACKGROUND_COLOR
    )
    val.cardData.date = val.date
    this.setState({
      stage: new createjs.Stage(ReactDOM.findDOMNode(this.refs.canvas)),
      bitmap: new createjs.Bitmap(card.getRenderedCardFromValues(val.cardData)),
      cardData: val.cardData
    }, () => {
      this.state.stage.addChild(this.state.bitmap)
      this.state.stage.update()
    })
  }

  convertTimeStampToDate (timeStamp) {
    return new Date(parseInt(timeStamp)).toString()
  }

  render () {
    const options = this.state.playHistory.map((play) => {
      var tmpDate = this.convertTimeStampToDate(play.key)
      return {value: play.key, label: play.key + ' - ' + tmpDate, cardData: play.value, date: tmpDate}
    })


    return (
      <div className='list'>
        <Select
          name="form-field-name"
          value="one"
          options={options}
          onChange={this.renderPlayHandler}
        />
       {this.state.cardData != undefined ? <div className='info'><small>result: {this.state.cardData.winingCard ? 'Win' : 'Lose'} <br /> date: {this.state.cardData.date} <br /></small></div> : ''}
       <div className='scratchCardContainer'>
         <canvas ref='canvas' width={Configs._WIDTH} height={Configs._HEIGHT}></canvas>      
       </div>
      </div>
    )
  }
}
