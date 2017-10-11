import CreateJs from 'yuki-createjs'

export default class cardGenerator{

    constructor (width,height,circleSymbolColor,crossSymbolColor,winningHighLigthColor,backgroundColor) {
      this._WIDTH = width
      this._HEIGHT = height
      this._CIRCLE_SYMBOL_COLOR = circleSymbolColor
      this._CROSS_SYMBOL_COLOR = crossSymbolColor
      this._WINING_HIGHLIGTH_COLOR = winningHighLigthColor
      this._BACKGROUND_COLOR = backgroundColor

      this.tmpWin = {
        winnerSymbol: undefined,
        winingCard: false,
        winingPositions: [],
        cardInfo: [],
        cardId:  Date.now().toString()
      }
    }

    getWinnerSymbol () {
      return this.tmpWin.winnerSymbol
    }

    getWiningCard () {
      return this.tmpWin.winingCard
    }

    getWiningPositions () {
      return this.tmpWin.winingPositions
    }

    getCard () {
      return this.generatePlay()
    }

    getCardInfo () {
      return this.tmpWin
    }

    getRenderedCardFromValues (data) {
      console.log(data)
      this.tmpWin = {
        winnerSymbol: data.winnerSymbol,
        winingCard: data.winingCard,
        winingPositions: data.winingPositions
      }
      return this.renderCardImg(data.cardInfo)
    }

    generatePlay () {
      //0 - empty, 1 - x, 2 - O
      const maxNumberOfTurns = 9
      const play = [...Array(maxNumberOfTurns).keys()] //placeholder for play spot position
      const card = new Uint8Array(maxNumberOfTurns)
      let currentTurn = 1 // X - 1 or O - 2 current turn
      for(var i=0; i < 9; i++){ //a max of 9 turns
        var rand = Math.floor(Math.random() * play.length) //get a random spot to play
        card[play[rand]] = currentTurn //set the play to the currentTurn symbol
        play.splice(rand ,1) //remove the spot position from the play placeholder
        if(currentTurn === 1){// change the currentTurn onwer  X - 1 or O - 2
          currentTurn++
        }else{
          currentTurn--
        }
        if(i >= 4 ){ //check for winner after we have a minimum of 5 plays, i starts on 0
          //check wining or lose card
          if(this.checkWin(card,0,1,2) || this.checkWin(card,3,4,5) || this.checkWin(card,6,7,8)){//horizontal
            break //win found - interrupt play
          } else if (this.checkWin(card,0,3,6) || this.checkWin(card,1,4,7) || this.checkWin(card,2,5,8)){//vertical
            break //win found - interrupt play
          } else if (this.checkWin(card,0,4,8) || this.checkWin(card,6,4,2)){//diagonal
            break //win found - interrupt play
          }
        }
      }
      this.tmpWin.cardInfo = card
      return this.renderCardImg(card)
    }

    renderCardImg(values){
      var container = new createjs.Container() //cretae a global container for the card

      //background
      var bg = new createjs.Shape()
      bg.graphics.beginFill(this._BACKGROUND_COLOR)
      bg.graphics.drawRect(0, 0, this._WIDTH, this._HEIGHT)
      bg.graphics.endFill()

      //grid
      var grid = new createjs.Shape()
      grid.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,1)")
      //grid H
      var gridY = this._WIDTH / 3
      for(var i=0; i < 2; i++){
        grid.graphics.moveTo(0, gridY)
        grid.graphics.lineTo(this._WIDTH,gridY)
        gridY = gridY * 2
      }
      //grid V
      var gridX = this._HEIGHT / 3
      for(var i=0; i < 2; i++){
        grid.graphics.moveTo(gridX, 0)
        grid.graphics.lineTo(gridX,this._HEIGHT)
        gridX = gridX * 2
      }
      grid.graphics.endStroke()
      container.addChild(bg, grid)

      //symbols
      var startX = (this._WIDTH / 3) / 2
      var startY = (this._HEIGHT / 3) / 2
      var width = (this._WIDTH / 3) / 2
      var height = (this._HEIGHT / 3) / 2
      var increment = (this._WIDTH / 3)
      var ctrl = 0
      values.map((i, index)=>{ //map all values of the generated play and draw the symbols
          if(ctrl === 3){ //break the line on the 3rd element of each line
            startY = startY + increment
            startX = (this._WIDTH / 3) / 2
            ctrl = 1
          }else{
            ctrl++
          }
        var symbol = new createjs.Shape()
        if(i===1){ //X
           var startPointX = startX - width / 2
           var startPointY = startY - height / 2
           symbol.graphics.setStrokeStyle(1).beginStroke(this._CROSS_SYMBOL_COLOR)
           symbol.graphics.moveTo(startPointX, startPointY)
           symbol.graphics.lineTo(startPointX + width, startPointY + height)
           symbol.graphics.moveTo(startPointX + width, startPointY)
           symbol.graphics.lineTo(startPointX, startPointY + height)
           symbol.graphics.endStroke()
           if(this.tmpWin.winingCard && this.tmpWin.winnerSymbol === 1) {
             this.tmpWin.winingPositions.find((i) => {
               if(i === index){
                  symbol.graphics.setStrokeStyle(1).beginStroke(this._WINING_HIGHLIGTH_COLOR).drawRect(startX - 10 - width / 2 , startY - 10 - height  / 2, width + 20, height + 20)
               }
             })
           }
        } else if(i===2){ //O
          symbol.graphics.setStrokeStyle(1).beginStroke(this._CIRCLE_SYMBOL_COLOR).drawCircle(startX, startY, width / 2, width / 2)
        }
        container.addChild(symbol) // add symbol to the container
        startX = startX + increment
      })
      container.cache(0,0,this._WIDTH, this._HEIGHT) //cache the container
      return container.cacheCanvas //return the cached version to be render in a bitmap
    }

    checkWin(values,p1,p2,p3){
      //if values are not 0 - empty play and values are all the same on the requested positions we found a winner
      if( (values[p1] === values[p2] && values[p1] === values[p3]) && (values[p1] !== 0 || values[p2] !==0 || values[p3] != 0)){
        this.tmpWin = {
          winnerSymbol: values[p1], //can be X or O
          winingCard: values[p1] === 1 ? true : false, //if the symbol i X - 1 , player wins the card
          winingPositions: [p1,p2,p3]
        }
        return true
      } else { // no winner
        return false
      }
    }
}
