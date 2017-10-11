import React from 'react'
import ReactDOM from "react-dom"
import CreateJs from 'yuki-createjs'

import cardGenerator from './cardgenerator.js'
import * as WalletActions from '../../actions/walletActions'
import * as HistoryActions from '../../actions/historyActions'

import * as Labels from './config/labels.js'
import * as Configs from '../../config/config.js'

export default class ScratchCardController extends React.Component {
  constructor () {
    super()

    this.state = {
      stage: undefined,
      bitmap: undefined,
      cursor: undefined,
      isDrawing: undefined,
      oldMidPt: undefined,
      oldPt: undefined,
      revealled: false,
      winnerSymbol: undefined,
      winingCard: false,
      winingPositions: [],
      showRevealButton: true,
    }

    //event biddings
    this.handleMouseDownHandler = this.handleMouseDown.bind(this)
    this.handleMouseUpHandler = this.handleMouseUp.bind(this)
    this.handleMouseMoveHandler = this.handleMouseMove.bind(this)
    this.reveallHandler = this.reveall.bind(this)
    this.newCardHandler = this.newCard.bind(this)
    this.tickHandler = this.tick.bind(this)
  }

  componentDidMount () {
    this.setState({
      stage: new createjs.Stage(ReactDOM.findDOMNode(this.refs.canvas)),
    }, ()=>{
      createjs.Ticker.timingMode = createjs.Ticker.RAF
      createjs.Ticker.addEventListener('tick', this.tickHandler)
      this.newCard()
      createjs.Touch.enable(this.state.stage)
      this.loadSounds()
    })
  }

  componentWillUnmount () {
    this.cleanStage()
  }

  initialState () { //reset state to initial values
    this.setState({
      bitmap: undefined,
      cursor: undefined,
      isDrawing: undefined,
      oldMidPt: undefined,
      oldPt: undefined,
      revealled: false,
      winnerSymbol: undefined,
      winingCard: false,
      winingPositions: []
    })
  }

  newCard () {
    WalletActions.decreaseFunds({amount: Configs._CARD_VALUE})
    this.cleanStage()
    var card = new cardGenerator(
      Configs._WIDTH,
      Configs._HEIGHT,
      Configs._CIRCLE_SYMBOL_COLOR,
      Configs._CROSS_SYMBOL_COLOR,
      Configs._WINING_HIGHLIGTH_COLOR,
      Configs._BACKGROUND_COLOR
    )
    this.setState({
       drawingCanvas: new createjs.Shape(),
       rect: new createjs.Shape(),
       bitmap: new createjs.Bitmap(card.getCard()),
       winnerSymbol: card.getWinnerSymbol(),
       winingCard: card.getWiningCard(),
       winingPositions: card.getWiningPositions(),
       cursor: new createjs.Shape(new createjs.Graphics().beginFill(Configs._CURSOR_COLOR).drawCircle(0, 0, Configs._CURSOR_SIZE)),
       showRevealButton: true
    },this.prepareStage)
    //save card to history
    HistoryActions.ActionSavePlay(card.getCardInfo(), ()=>{console.log('saved')})
  }

  cleanStage () {
    if(this.state.stage !== undefined){
      createjs.Sound.stop()
      createjs.Tween.removeTweens(this.state.stage)
      this.state.stage.removeAllChildren()
      this.state.stage.removeAllEventListeners()
      this.state.stage.update()
      this.initialState()
    }
  }

  loadSounds(){
    var assetsPath = '../../assets/sounds/';
    var sounds = [
      {src:'lose.mp3', id: 'lose'},
      {src:'win.mp3', id: 'win'},
      {src:'scratch.mp3', id: 'scratch', data: {channels:1}}]
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.registerSounds(sounds, assetsPath);
    createjs.Sound.volume = 0.2;
  }

  prepareStage (){
    this.state.stage.enableMouseOver()
    this.state.cursor.cursor = "pointer"
    this.state.cursor.alpha = 0
    this.state.stage.addEventListener("stagemousedown", this.handleMouseDownHandler)
    this.state.stage.addEventListener("stagemouseup", this.handleMouseUpHandler)
    this.state.stage.addEventListener("stagemousemove", this.handleMouseMoveHandler)

    this.state.drawingCanvas.cache(0, 0, Configs._WIDTH, Configs._HEIGHT)
    this.state.bitmap.filters = [new createjs.AlphaMaskFilter(this.state.drawingCanvas.cacheCanvas)]
    this.state.bitmap.cache(0, 0, Configs._WIDTH, Configs._HEIGHT)

    this.state.rect.graphics.beginFill(Configs._SCRATCH_SURFACE_COLOR)
    this.state.rect.graphics.drawRect(0, 0, Configs._WIDTH, Configs._HEIGHT)
    this.state.rect.graphics.endFill()
    this.state.rect.cache(0, 0,Configs._WIDTH, Configs._HEIGHT)

    this.state.stage.addChild(this.state.rect, this.state.bitmap, this.state.cursor)
    this.state.stage.update()
  }

  tick (event) { //main loop, only used for play the animations
    this.state.stage.update(event)
  }

  handleMouseDown(event) {
    createjs.Tween.get(this.state.cursor, {loop: 0, override: true})
			.to({alpha: 1}, 1000, createjs.Ease.getPowOut(1.5));
    var point = new createjs.Point(this.state.stage.mouseX, this.state.stage.mouseY)
  	this.setState({
      oldPt: point,
      oldMidPt: point,
      isDrawing: true
    })
  }

  handleMouseMove(event) {
    this.state.cursor.x = this.state.stage.mouseX
    this.state.cursor.y = this.state.stage.mouseY
    if (!this.state.isDrawing) {
      this.state.stage.update()
      return
    }
    createjs.Sound.play('scratch')
    var midPoint = new createjs.Point(this.state.oldPt.x + this.state.stage.mouseX >> 1, this.state.oldPt.y + this.state.stage.mouseY >> 1)
    this.state.drawingCanvas.graphics.clear()
      .setStrokeStyle(Configs._SCRATCH_REVEAL_AMOUNT, "round", "round")
      .beginStroke("rgba(0,0,0,1)")
      .moveTo(midPoint.x, midPoint.y)
      .curveTo(this.state.oldPt.x, this.state.oldPt.y, this.state.oldMidPt.x, this.state.oldMidPt.y)
    this.state.oldPt.x = this.state.stage.mouseX
    this.state.oldPt.y = this.state.stage.mouseY
    this.state.oldMidPt.x = midPoint.x
    this.state.oldMidPt.y = midPoint.y
    this.state.drawingCanvas.updateCache("source-over")
    this.state.bitmap.updateCache()
    this.state.stage.update()
  }

  handleMouseUp(event) {
    createjs.Sound.stop()
    createjs.Tween.get(this.state.cursor, {loop: 0, override: true})
			.to({alpha: 0}, 1000, createjs.Ease.getPowOut(1.5));
  	this.setState({
      isDrawing: false
    })
    //check how much ot the scratch is revealled
    //since this is a expensive operation, execute it only on mouse up event, instead of on mouse move
    if(this.getScratchAmount() >= Configs._SCRATCH_DECLARE_WINNER_AFTER){
        this.reveall ()
    }
  }

  getScratchAmount() {
    var alphaPixels = 0
    var alphaMaskFilter = new createjs.AlphaMapFilter(this.state.drawingCanvas.cacheCanvas)
    var canvas = alphaMaskFilter.alphaMap
    var ctx = canvas.getContext("2d")
    var data = ctx.getImageData(0,0, ctx.canvas.width,ctx.canvas.height).data
    for(var i=3; i<data.length; i+=4) {
      if(data[i] > 0) alphaPixels++
    }
    return Math.round(alphaPixels / (ctx.canvas.width * ctx.canvas.height)* 100)
  }

  showResult() {
    if(!this.state.revealled){
      this.setState({
        revealled: true,
        showRevealButton: false
      })
      var text = new createjs.Text()
      text.font =  '1.8em Arial bold'
      text.color = '#ff7700'
      if(this.state.winingCard){ //winning symbol is X and theres horizontal, vertical or diagonal wining line
        WalletActions.increaseFunds({amount: Configs._CARD_VALUE * Configs._WINING_RATIO})
        text.text = Configs._WIN_TXT
        createjs.Sound.play('win')
      }else {
        text.text = Configs._LOSE_TXT
        createjs.Sound.play('lose')
      }
      var textBounds = text.getBounds()
      text.scaleX = 0.1;
      text.scaleY = 0.1;
      text.textAlign = 'center';
      text.textBaseline = 'middle';
      text.x = Configs._WIDTH / 2;
      text.y = Configs._HEIGHT / 2;
      this.state.stage.addChild(text)
      createjs.Tween.get(text, {loop: 0, override: true})
        .to({scaleX:1.0,scaleY:1.0, rotation: 360},1000)
    }
  }

  reveall () {
    this.showResult()
    this.state.stage.removeChild(this.state.rect)
    this.state.bitmap.filters = []
    this.state.bitmap.updateCache()
    this.state.stage.update()
  }

  render () {
    return (
      <div className='scratchCardContainer'>
        <div className='butttonsContainer'>
          {this.state.showRevealButton ? <button onClick={this.reveallHandler}>{Labels._REVEALL_BTN}</button> : <button onClick={this.newCardHandler}>{Labels._NEW_CARD_BTN}</button>}
        </div>
        <div className='canvasContainer'>
          <canvas ref='canvas' width={Configs._WIDTH} height={Configs._HEIGHT}></canvas>
        </div>
      </div>
    )
  }
}
