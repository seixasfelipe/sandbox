class Map {

  constructor(rows, cols) {
    this._rows = rows
    this._cols = cols
    this._map = []

    for(let i=0; i<this.rows*this.cols; i++) {
      this._map[i] = 0
    }
  }

  get rows() {
    return this._rows
  }

  get cols() {
    return this._cols
  }

  get totalTiles() {
    return this._rows*this._cols
  }

  valueAt(index) {
    return this._map[index]
  }

  update(index, value) {
    this._map[index] = value
  }

  storeRoom(room, value) {

    const that = this
    // will it overflow the map?
    if(room.mapPos.row + room.dimensions.nbRows > this._rows - 1 || // margin tile (-1)
       room.mapPos.col + room.dimensions.nbCols > this._cols - 1)
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
    const lastPos = i + (room.dimensions.nbRows - 1) * this._cols + room.dimensions.nbCols
    let lastPosCurrentRow = i + room.dimensions.nbCols - 1
    let backup = []

    if(value === undefined) {
      value = 1
    }

    do {
      backup.push({ index: i, value: this.valueAt(i) })

      if(this.valueAt(i) !== 0) {
        break
      }

      this.update(i, value)

      if(i === lastPosCurrentRow) {
        i = i + this._cols - room.dimensions.nbCols + 1 // switch to next row
        lastPosCurrentRow = i + room.dimensions.nbCols - 1
      } else {
        i = i + 1 // same row
      }
    } while( i < lastPos )

    if(backup.length < room.dimensions.nbRows * room.dimensions.nbCols) {
      backup.forEach(function(elem) {
        that.update(elem.index, elem.value)
      })
      return false
    }

    return true
  }
}
