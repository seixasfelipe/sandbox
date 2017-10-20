function result(desc, expected, actuel) {
  if(expected === actuel) {
    console.log(`PASSED ${desc} was ${actuel}`)
  } else {
    console.warn(`FAIL ${desc} should be ${expected} but was ${actuel}`)
  }
}

function createMap() {
  const map = new Map(6, 6)

  /****************
  0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0,
  0, 0, 1, 1, 0, 0,
  0, 0, 1, 1, 0, 0,
  0, 0, 0, 0, 0, 0
  *****************/
  map.storeRoom({
    mapPos: { row:3, col:2 },
    dimensions: { nbRows: 2, nbCols: 2 }
  })

  return map
}

function test_store_room_top() {

  const dimensions = { nbRows: 2, nbCols: 2 }

  /****************
  X, X, 0, 0, 0, 0,
  X, X, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0,
  0, 0, 1, 1, 0, 0,
  0, 0, 1, 1, 0, 0,
  0, 0, 0, 0, 0, 0
  *****************/
  result('room at 0,0', true, createMap().storeRoom({ mapPos: {row:0, col:0}, dimensions: dimensions }))

  /****************
  0, 0, 0, 0, 0, 0,
  X, X, 0, 0, 0, 0,
  X, X, 0, 0, 0, 0,
  0, 0, 1, 1, 0, 0,
  0, 0, 1, 1, 0, 0,
  0, 0, 0, 0, 0, 0
  *****************/
  result('room at 1,0', false, createMap().storeRoom({ mapPos: {row:1, col:0}, dimensions: dimensions }))

  /****************
  0, 0, 0, 0, 0, 0,
  0, 0, X, X, 0, 0,
  0, 0, X, X, 0, 0,
  0, 0, 1, 1, 0, 0,
  0, 0, 1, 1, 0, 0,
  0, 0, 0, 0, 0, 0
  *****************/
  result('room at 1,2', false, createMap().storeRoom({ mapPos: {row:1, col:2}, dimensions: dimensions }))

  /****************
  0, 0, 0, X, X, 0,
  0, 0, 0, X, X, 0,
  0, 0, 0, 0, 0, 0,
  0, 0, 1, 1, 0, 0,
  0, 0, 1, 1, 0, 0,
  0, 0, 0, 0, 0, 0
  *****************/
  result('room at 0,3', true, createMap().storeRoom({ mapPos: {row:0, col:3}, dimensions: dimensions }))
}
