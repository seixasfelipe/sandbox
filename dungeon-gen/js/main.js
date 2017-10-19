let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

canvas.addEventListener('click', generateDungeon, false)
canvas.addEventListener('mousemove', function(e) {
  document.getElementById('screenCoord').innerHTML = e.x + ',' + e.y
}, false)
canvas.width = 640
canvas.height = 480

const tileSize = 6
const tileBorder = 1
const nbRooms = 100
let map

// from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function relativeScreenLength(qtyTiles) {
  return qtyTiles * tileSize + qtyTiles * tileBorder + tileBorder
}

function convertToScreenCoord(row, col) {
  return {
    x: row * (tileSize + tileBorder) + (tileSize + tileBorder), // margin left
    y: col * (tileSize + tileBorder) + (tileSize + tileBorder) // margin top
  }
}

function drawRoom(room) {

  const width = relativeScreenLength(room.dimensions.nbCols)
  const height = relativeScreenLength(room.dimensions.nbRows)
  const screenCoord = convertToScreenCoord(room.mapPos.col, room.mapPos.row)

  const initX = screenCoord.x
  const initY = screenCoord.y

  // room tile borders
  ctx.fillStyle = "#abab9a"
  ctx.fillRect(initX, initY, width, height)

  // room tiles
  ctx.fillStyle = "#c4c4b0"
  for(let i=0; i<room.dimensions.nbRows; i++) {
    for(let j=0; j<room.dimensions.nbCols; j++) {
      ctx.fillRect(initX + relativeScreenLength(j),
        initY + relativeScreenLength(i),
        tileSize,
        tileSize)
    }
  }

  // room top
  ctx.fillStyle = "#626258"
  ctx.fillRect(initX, screenCoord.y, width, 2 * tileBorder)

  room.screenCoord = screenCoord
}

function createRoom() {
  return {
    mapPos: {
      row: getRandomIntInclusive(0, map.cols - 1),
      col: getRandomIntInclusive(0, map.rows - 1)
    },
    dimensions: {
      nbRows: getRandomIntInclusive(3, 10),
      nbCols: getRandomIntInclusive(3, 10)
    },
  }
}

function storeRoom(room, value) {

  // will it overflow the map?
  if(room.mapPos.row + room.dimensions.nbRows > map.rows - 1 || // margin tile (-1)
     room.mapPos.col + room.dimensions.nbCols > map.cols - 1)
     return false

  // has no adjacent room on top
  // if(room.mapPos.row > 0) {
  //
  //   let previousRow = (room.mapPos.row - 1)*map.cols - 1 + room.dimensions.nbCols - 1
  //
  //   // for(let i=room.mapPos.row*map.cols - 1; 0 < i < )
  //
  // }

  // has no adjacent room on bottom
  // if(room.mapPos.row + room.dimensions.nbRows + 1 < map.rows) {
  //   let nextRowBeginIndex = (room.mapPos.row + 1)*
  // }

  let i = room.mapPos.row*map.cols + room.mapPos.col
  const lastPos = i + (room.dimensions.nbRows - 1) * map.cols + room.dimensions.nbCols
  let lastPosCurrentRow = i + room.dimensions.nbCols - 1
  let backup = []

  if(value === undefined) {
    value = 1
  }

  do {
    backup.push({ index: i, value: map.valueAt(i) })

    if(map.valueAt(i) !== 0) {
      break
    }

    map.update(i, value)

    if(i === lastPosCurrentRow) {
      i = i + map.cols - room.dimensions.nbCols + 1 // switch to next row
      lastPosCurrentRow = i + room.dimensions.nbCols - 1
    } else {
      i = i + 1 // same row
    }
  } while( i < lastPos )

  if(backup.length < room.dimensions.nbRows * room.dimensions.nbCols) {
    backup.forEach(function(elem) {
      map.update(elem.index, elem.value)
    })
    return false
  }

  return true
}

function reset() {
  ctx.fillStyle = "#31312C" //"#d0d0d0"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const tilesPerRow = Math.floor(canvas.width / (tileSize + tileBorder)) - 2 // margin left/right
  const tilesPerCol = Math.floor(canvas.height / (tileSize + tileBorder)) - 2 // margin top/bottom

  map = new Map(tilesPerCol, tilesPerRow)
}

function generateDungeon() {

  reset()

  for(let i=0; i<nbRooms; i++) {

    let room = createRoom()
    if(storeRoom(room, i+1))
      drawRoom(room)
  }
}

generateDungeon()
