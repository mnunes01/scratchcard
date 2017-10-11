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
    //inital state
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
      stage: new createjs.Stage(ReactDOM.findDOMNode(this.refs.canvas)), //create or stage from the dom element canvas
    }, ()=>{
      createjs.Ticker.timingMode = createjs.Ticker.RAF //register the ticker to run the animations
      createjs.Ticker.addEventListener('tick', this.tickHandler)
      this.newCard() //prepare a new card
      createjs.Touch.enable(this.state.stage) //enable Touch
      this.loadSounds() //load sounds
    })
  }

  componentWillUnmount () {
    this.cleanStage() //destruct any references
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

  newCard () { //generate a new card and save it to history
    WalletActions.decreaseFunds({amount: Configs._CARD_VALUE})
    this.cleanStage() //clean everything first
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
       bitmap: new createjs.Bitmap(card.getCard()), //grab the cached bitmap and preapre it to be added to the stage
       winnerSymbol: card.getWinnerSymbol(), //grab the generated card info and propagate it to component state
       winingCard: card.getWiningCard(),
       winingPositions: card.getWiningPositions(),
       cursor: new createjs.Shape(new createjs.Graphics().beginFill(Configs._CURSOR_COLOR).drawCircle(0, 0, Configs._CURSOR_SIZE)), //scracth cursor
       showRevealButton: true
    },this.prepareStage)
    //save card to history
    HistoryActions.ActionSavePlay(card.getCardInfo(), ()=>{console.log('saved')})
  }

  cleanStage () { // before we can create a card and show it for paly we need to ensure the previous one have been destroyed
    if(this.state.stage !== undefined){ //if we have a stage, a previous card have been played
      createjs.Sound.stop() //stop all playing sounds
      createjs.Tween.removeTweens(this.state.stage) //remove all playing animations
      this.state.stage.removeAllChildren() //remove all stage childrens
      this.state.stage.removeAllEventListeners() // remove all listeners, mouse, animations etc...
      this.state.stage.update() //update the stage to new status
      this.initialState() // set component state to a reset state value
    }
  }

  loadSounds(){ //loading sounds
    var assetsPath = '/assets/sounds/';
    var sounds = [
      {src:'lose.mp3', id: 'lose'},
      {src:'win.mp3', id: 'win'},
      {src:'scratch.mp3', id: 'scratch', data: {channels:1}}]
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.registerSounds(sounds, assetsPath);
    createjs.Sound.volume = 0.2;
  }

  prepareStage (){ //prepare the stage and add the card image and the scratch overlay
    this.state.stage.enableMouseOver() //enable mouse interections
    this.state.cursor.cursor = "pointer"
    this.state.cursor.alpha = 0
    this.state.stage.addEventListener("stagemousedown", this.handleMouseDownHandler) //register the event listners
    this.state.stage.addEventListener("stagemouseup", this.handleMouseUpHandler)
    this.state.stage.addEventListener("stagemousemove", this.handleMouseMoveHandler)

    this.state.drawingCanvas.cache(0, 0, Configs._WIDTH, Configs._HEIGHT) //create a canvas so we can scratch
    this.state.bitmap.filters = [new createjs.AlphaMaskFilter(this.state.drawingCanvas.cacheCanvas)] //aply a alpha filter to the generated card bitmap
    this.state.bitmap.cache(0, 0, Configs._WIDTH, Configs._HEIGHT) //cache the filter result for performance

    this.state.rect.graphics.beginFill(Configs._SCRATCH_SURFACE_COLOR) //scracth overlay
    this.state.rect.graphics.drawRect(0, 0, Configs._WIDTH, Configs._HEIGHT)
    this.state.rect.graphics.endFill()
    this.state.rect.cache(0, 0,Configs._WIDTH, Configs._HEIGHT)

    this.state.stage.addChild(this.state.rect, this.state.bitmap, this.state.cursor) //add all elements to stage
    this.state.stage.update() //and update the display
  }

  tick (event) { //main loop, only used for play the animations
    this.state.stage.update(event)
  }

  handleMouseDown(event) { // user press down, register the point where the user is starting to scracth
    createjs.Tween.get(this.state.cursor, {loop: 0, override: true})
			.to({alpha: 1}, 1000, createjs.Ease.getPowOut(1.5));
    var point = new createjs.Point(this.state.stage.mouseX, this.state.stage.mouseY)
  	this.setState({
      oldPt: point,
      oldMidPt: point,
      isDrawing: true
    })
  }

  handleMouseMove(event) { //scracth, removing part of the scracth layer as the user moves the mouse. We basic drawing with a rubber on the scracth overlay
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

  handleMouseUp(event) { //stop the scracth, check if the card is already enough revelaed to give win lose feedback to the user
    createjs.Sound.stop() //stop scracth sound
    createjs.Tween.get(this.state.cursor, {loop: 0, override: true}) //animate the cursor to fade away
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

  getScratchAmount() { //check all the pixels to figure out whats the percentage of trasnparent ones at the moment.
    var alphaPixels = 0
    var alphaMaskFilter = new createjs.AlphaMapFilter(this.state.drawingCanvas.cacheCanvas)
    var canvas = alphaMaskFilter.alphaMap
    var ctx = canvas.getContext("2d")
    var data = ctx.getImageData(0,0, ctx.canvas.width,ctx.canvas.height).data
    for(var i=3; i<data.length; i+=4) { //check every 4 positions, since the imagedata is rgbA (R,G,B,A) and we only interested on the Alpha value
      if(data[i] > 0) alphaPixels++
    }
    //calculate and return the percentage of alpha pixels
    return Math.round(alphaPixels / (ctx.canvas.width * ctx.canvas.height)* 100)
  }

  showResult() { // show the user with some animations and sounds the outcome of the scracth card, increase funds on winning
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

  reveall () { //if the user hits the reveall button or the scracths the card enough to be revealled lets show the result and clear the unused layers 
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
