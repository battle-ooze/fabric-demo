
const LinkLine = fabric.util.createClass(fabric.Path, {
  type: 'link-line',
  fill: 'transparent',
  stroke: '#ccc',
  selectable: false,
  lockMovementX: true,
  lockMovementY: true,
  strokeWidth: 1,
  originX: 'left',
  originY: 'top',
  perPixelTargetFind: true,
  _close: null,
  
  initialize ([x1, y1, x2, y2], options) {
    this.callSuper('initialize', [['M', 0, 0]], options)
    this.setPath([x1, y1, x2, y2])
    this.on('mouseup', this._onMouseUp)
    this.on('mouseover', this._onMouseOver)
    this.on('mouseout', this._onMouseOut)
  },

  _onMouseUp () {
    if (this._close) {
      this.canvas.remove(this._close)
    }
    if (this.canvas) {
      this.canvas.remove(this)
    }
  },

  _onMouseOut () {
    this.stroke = '#ccc'
    this.removeClose()
    this.canvas.requestRenderAll()
  },

  _onMouseOver () {
    this.showClose()
    this.stroke = '#6682ff'
    this.canvas.requestRenderAll()
  },

  _onGroupMove () {
    let startPoint = this.startPoint
    let endPoint = this.endPoint
    let x1 = startPoint.group ? startPoint.group.left + startPoint.left : startPoint.left
    let y1 = startPoint.group ? startPoint.group.top + startPoint.top : startPoint.top
    let x2 = endPoint.group ? endPoint.group.left + endPoint.left : endPoint.left
    let y2 = endPoint.group ? endPoint.group.top + endPoint.top : endPoint.top
    this.setPath([x1, y1, x2, y2])
  },

  showClose () {
    if (!this._close) {
      this._close = new fabric.Text('×', {
        fontSize: 20,
        fill: 'red'
      })
    }
    this.canvas.add(this._close)
    let dims = this._parseDimensions()
    this._close.left = dims.left + dims.width / 2
    this._close.top = dims.top + dims.height / 2
    this.canvas.requestRenderAll()
  },

  removeClose () {
    if (this._close) {
      this.canvas.remove(this._close)
    }
  },

  linkPoint (startPoint, endPoint) {
    let x1 = startPoint.group ? startPoint.group.left + startPoint.left : startPoint.left
    let y1 = startPoint.group ? startPoint.group.top + startPoint.top : startPoint.top
    let x2 = endPoint.group ? endPoint.group.left + endPoint.left : endPoint.left
    let y2 = endPoint.group ? endPoint.group.top + endPoint.top : endPoint.top

    this.startPoint = startPoint
    this.endPoint = endPoint
    this.startPoint.group.on('moving', this._onGroupMove.bind(this))
    this.endPoint.group.on('moving', this._onGroupMove.bind(this))

    this.setPath([x1, y1, x2, y2])
  },

  setPath ([x1, y1, x2, y2]) {
    let r = Math.min(4, Math.abs(x2 - x1), Math.abs(y2 - y1))
    let rx = x1 > x2 ? -1 : 1
    let ry = y1 > y2 ? -1 : 1
    let sweepFlag = +((y1 - y2) / (x1 - x2) < 0)
    this.path = [
      ['M', x1, y1],
      ['V', y1 + ((y2 - y1) / 2 - ry * r)],
      ['A', r, r, 0, 0, sweepFlag, x1 + rx * r, (y2 - y1) / 2 + y1],
      ['H', x2 - rx * r],
      ['A', r, r, 0, 0, +!sweepFlag, x2, (y2 - y1) / 2 + ry * r + y1],
      ['V', y2]
    ]
    this.pathOffset = null
    this._setPositionDimensions({})
    this.setCoords()
  }
})

fabric.LinkLine = LinkLine
