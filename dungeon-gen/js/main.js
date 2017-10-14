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

function drawRoom(x, y, nbRows, nbCols) {

  const initX = x
  const initY = y + tileBorder

  const relativeSize = function(multiplier) {
    return multiplier * tileSize + multiplier * tileBorder + tileBorder
  }

  const width = relativeSize(nbRows)
  const height = relativeSize(nbCols)

  // room tile borders
  ctx.fillStyle = "#abab9a"
  ctx.fillRect(initX, initY, width, height)

  // room tiles
  ctx.fillStyle = "#c4c4b0"
  for(let i=0; i<nbRows; i++) {
    for(let j=0; j<nbCols; j++) {
      ctx.fillRect(initX + relativeSize(i),
        initY + relativeSize(j),
        tileSize,
        tileSize)
    }
  }

  // room top
  ctx.fillStyle = "#626258"
  ctx.fillRect(initX, y, width, 2 * tileBorder)

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

  let x, y, nbRows, nbCols

  for(let i=0; i<nbRooms; i++) {
    x = getRandomIntInclusive(0, canvas.width)
    y = getRandomIntInclusive(0, canvas.height)
    nbRows = getRandomIntInclusive(2, 10)
    nbCols = getRandomIntInclusive(2, 10)

    drawRoom(x, y, nbRows, nbCols)
  }
}

generateDungeon()
