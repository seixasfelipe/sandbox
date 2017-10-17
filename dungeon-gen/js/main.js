let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

canvas.addEventListener('click', generateDungeon, false)
canvas.addEventListener('mousemove', function(e) {
  document.getElementById('screenCoord').innerHTML = e.x + ',' + e.y
}, false)
canvas.width = 640
canvas.height = 480

const tileSize = 12
const tileBorder = 1
const nbRooms = 15
const tilesPerRow = Math.floor(canvas.width / (tileSize + tileBorder)) - 2 // margin left/right
const tilesPerCol = Math.floor(canvas.height / (tileSize + tileBorder)) - 2 // margin top/bottom
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
  // console.log(room)
}

function createRoom() {
  return {
    mapPos: {
      row: getRandomIntInclusive(0, tilesPerRow - 1),
      col: getRandomIntInclusive(0, tilesPerCol - 1)
    },
    dimensions: {
      nbRows: getRandomIntInclusive(3, 10),
      nbCols: getRandomIntInclusive(3, 10)
    },
  }
}

function storeRoom(room, value) {

  // will it overflow the map?
  if(room.mapPos.row + room.dimensions.nbRows > tilesPerCol - 1 || // margin tile (-1)
     room.mapPos.col + room.dimensions.nbCols > tilesPerRow - 1)
     return false

  let i = room.mapPos.row*tilesPerRow + room.mapPos.col
  const lastPos = i + (room.dimensions.nbRows - 1) * tilesPerRow + room.dimensions.nbCols
  let lastPosCurrentRow = i + room.dimensions.nbCols - 1
  let backup = []

  do {
    backup.push({ index: i, value: map[i] })

    if(map[i] !== undefined) {
      break
    }

    map[i] = value

    if(i === lastPosCurrentRow) {
      i = i + tilesPerRow - room.dimensions.nbCols + 1 // switch to next row
      lastPosCurrentRow = i + room.dimensions.nbCols - 1
    } else {
      i = i + 1 // same row
    }
  } while( i < lastPos )

  // for(let i=room.mapPos.row; i<room.dimensions.nbRows+room.mapPos.row; i++) {
  //   for(let j=room.mapPos.col; j<room.dimensions.nbCols+room.mapPos.col; j++) {
  //     let index = j + i*tilesPerRow
  //
  //     backup.push({ index: index, value: map[index] })
  //
  //     if(map[index] !== undefined) {
  //       break
  //     }
  //
  //     map[index] = value
  //   }
  // }

  if(backup.length < room.dimensions.nbRows * room.dimensions.nbCols) {
    backup.forEach(function(elem) {
      map[elem.index] = elem.value
    })
    return false
  }

  return true
}

function reset() {
  ctx.fillStyle = "#d0d0d0"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  map = new Array(tilesPerRow*tilesPerCol)
}

function generateDungeon() {

  reset()

  for(let i=0; i<nbRooms; i++) {

    let room = createRoom()
    if(storeRoom(room, i+1))
      drawRoom(room)
  }

  // let room = {mapPos: {row: 28, col: 31}, dimensions: {nbRows: 4, nbCols: 5}, screenCoord: {x: 377, y: 416}}
  // if(storeRoom(room, 1))
  //   drawRoom(room)
  //
  // room = {mapPos: {row: 10, col: 14}, dimensions: {nbRows: 8, nbCols: 5}, screenCoord: {x: 143, y: 195}}
  // if(storeRoom(room, 2))
  //   drawRoom(room)
  //
  // room = {mapPos: {row: 7, col: 7}, dimensions: {nbRows: 9, nbCols: 3}, screenCoord: {x: 104, y: 104}}
  // if(storeRoom(room, 3))
  //   drawRoom(room)
  //
  // room = {mapPos: {row: 2, col: 25}, dimensions: {nbRows: 3, nbCols: 4}, screenCoord: {x: 39, y: 338}}
  // if(storeRoom(room, 4))
  //   drawRoom(room)
  //
  // room = {mapPos: {row: 22, col: 6}, dimensions: {nbRows: 4, nbCols: 7}, screenCoord: {x: 299, y: 91}}
  // if(storeRoom(room, 5))
  //   drawRoom(room)
}

generateDungeon()



// function printHeader() {
//   const width = relativeScreenLength(tilesPerRow)
//   const height = relativeScreenLength(tilesPerCol)
//
//   const initX = 13
//   const initY = 0
//
//   // room tile borders
//   ctx.fillStyle = "#abab9a"
//   ctx.fillRect(initX, initY, width, 14)
//
//   // room tiles
//   ctx.fillStyle = "#cfcfff"
//   for(let i=0; i<1; i++) {
//     for(let j=0; j<tilesPerRow; j++) {
//       ctx.fillRect(initX + relativeScreenLength(j),
//         initY + relativeScreenLength(i),
//         tileSize,
//         tileSize)
//     }
//   }
//
//   // room top
//   ctx.fillStyle = "#626258"
//   ctx.fillRect(initX, screenCoord.y, width, 2 * tileBorder)
// }
//
// function printFooter() {
//   const width = relativeScreenLength(tilesPerRow)
//   const height = relativeScreenLength(tilesPerCol)
//
//   const initX = 13
//   const initY = canvas.height - 13
//
//   // room tile borders
//   ctx.fillStyle = "#abab9a"
//   ctx.fillRect(initX, initY, width, 14)
//
//   // room tiles
//   ctx.fillStyle = "#ffcfcf"
//   for(let i=0; i<1; i++) {
//     for(let j=0; j<tilesPerRow; j++) {
//       ctx.fillRect(initX + relativeScreenLength(j),
//         initY + relativeScreenLength(i),
//         tileSize,
//         tileSize)
//     }
//   }
//
//   // room top
//   ctx.fillStyle = "#626258"
//   ctx.fillRect(initX, screenCoord.y, width, 2 * tileBorder)
// }
//
// function printMap() {
//   let currentRow = 1
//   let outputLine = currentRow + '|'
//
//   for(let i=0; i<map.length; i++) {
//     if(map[i] === undefined)
//       map[i] = 0
//     outputLine += map[i] + ','
//     if(i===currentRow * tilesPerRow - 1) {
//       currentRow = currentRow + 1
//       outputLine = outputLine + '\n' + currentRow + '|'
//     }
//   }
//
//   // let outputLine = ''
//   // for(let i=0; i<tilesPerCol; i++) {
//   //   outputLine += i + '|'
//   //   for(let j=0; j<tilesPerRow; j++) {
//   //     let index = j + i*tilesPerRow
//   //
//   //     if(map[index] === undefined)
//   //       map[index] = 0
//   //
//   //     outputLine += map[index] + ','
//   //   }
//   //   outputLine += '\n'
//   // }
//
//   console.log(outputLine)
// }
//
// printHeader()
// printFooter()
// printMap()
