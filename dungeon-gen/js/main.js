let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

canvas.addEventListener('click', generateDungeon, false)
canvas.width = 640
canvas.height = 480

const tileSize = 12
const tileBorder = 1
const nbRooms = 15

// from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function relativeSize(multiplier) {
  return multiplier * tileSize + multiplier * tileBorder + tileBorder
}

function drawRoom(room) {

  const initX = room.screen.x
  const initY = room.screen.y + tileBorder

  // room tile borders
  ctx.fillStyle = "#abab9a"
  ctx.fillRect(initX, initY, room.screen.width, room.screen.height)

  // room tiles
  ctx.fillStyle = "#c4c4b0"
  for(let i=0; i<room.dimensions.nbRows; i++) {
    for(let j=0; j<room.dimensions.nbCols; j++) {
      ctx.fillRect(initX + relativeSize(i),
        initY + relativeSize(j),
        tileSize,
        tileSize)
    }
  }

  // room top
  ctx.fillStyle = "#626258"
  ctx.fillRect(initX, room.screen.y, room.screen.width, 2 * tileBorder)
}

function createRoom() {
  let x = getRandomIntInclusive(0, canvas.width)
  let y = getRandomIntInclusive(0, canvas.height)
  let nbRows = getRandomIntInclusive(2, 10)
  let nbCols = getRandomIntInclusive(2, 10)

  const width = relativeSize(nbRows)
  const height = relativeSize(nbCols)

  return {
    screen: {
      x: x,
      y: y,
      width: width,
      height: height
    },
    dimensions: {
      nbRows: nbRows,
      nbCols: nbCols
    },
    bounds: {
      upperLeft: { x: x, y: y },
      upperRight: { x: x + width, y: y },
      bottomRight: { x: x + width, y: y + height },
      bottomLeft: { x: x, y: y + height }
    }
  }
}

function clear() {
  ctx.fillStyle = "#d0d0d0"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function generateDungeon() {

  clear()



  for(let i=0; i<nbRooms; i++) {

    let room = createRoom()
    drawRoom(room)
  }
}

generateDungeon()
