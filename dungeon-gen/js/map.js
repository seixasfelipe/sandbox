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
}
