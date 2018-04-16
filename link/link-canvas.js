
fabric.Object.prototype.hasBorders = false
fabric.Object.prototype.hasControls = false
fabric.Object.prototype.objectCaching = false
fabric.Object.prototype.originX = 'center'
fabric.Object.prototype.originY = 'center'

const LinkCanvas = fabric.util.createClass(fabric.Canvas, {
  type: 'link-canvas',
  preserveObjectStacking: true,
  targetFindTolerance: 10,
  selection: false,

  // 暂存当前开始连接的点
  _currentStartPoint: null,

  // 暂存当前正在连接的线
  _currentLine: null,

  initialize (el, options) {
    this.callSuper('initialize', el, options)
    this.on('mouse:move', this._handleMouseMove.bind(this))
    this.on('mouse:down', this._handleMouseDown.bind(this))
    this.on('mouse:up', this._handleMouseUp.bind(this))
  },

  _handleMouseMove (e) {
    // 如果有连接线存在，改变连接线的结束点位置
    if (this._currentLinkLine) {
      let x1 = this._currentLinkLine.path[0][1]
      let y1 = this._currentLinkLine.path[0][2]
      this._currentLinkLine.setPath([
        x1, y1, e.e.offsetX - this.viewportTransform[4], e.e.offsetY - this.viewportTransform[5]
      ])
      this.requestRenderAll()
    }
  },

  _handleMouseDown (e) {    
    console.log(e)
    let target = this.getCurrentTarget(e)
    target && target.fire('graph:mousedown')
    // 如果是连接点就开始连接
    if (target && target.type === 'circle' && !this._currentLinkLine) {
      this.startLink(target)
    }
  },

  /**
   * mouseup 时，如果目标是 link-point 节点就尝试连接
   */
  _handleMouseUp (e) {
    let target = this.getCurrentTarget(e)
    if (this._currentLinkLine) {
      this.endLink(target)
    }
  },

  /**
   * 从一个节点开始连接
   */
  startLink (point) {
    let group = point.group
    let x = point.group.left + point.left
    let y = point.group.top + point.top
    let line = this.createLinkLine(x, y)

    // 移除所有选中和锁定 group
    this.discardActiveObject()
    group.lockMovementX = true
    group.lockMovementY = true

    this.add(line)
    line.sendToBack()
    this._currentLinkLine = line
    this._currentStartPoint = point
  },

  /**
   * 结束连接
   */
  endLink (target) {
    if (
      target && 
      target.type === 'circle' && 
      target.linkType !== this._currentStartPoint.linkType &&
      target.group !== this._currentStartPoint.group
    ) {    
      let point1 = this._currentStartPoint
      let point2 = target
      let line = this._currentLinkLine
      this.linkPoint(point1, point2, line)
    } else {
      this.remove(this._currentLinkLine)
    }
    this._currentStartPoint.group.lockMovementX = false
    this._currentStartPoint.group.lockMovementY = false
    this._currentLinkLine = null
    this._currentStartPoint = null
  },

  /**
   * 获取鼠标hover的对象
   */
  getCurrentTarget (e) {
    return (e.subTargets && e.subTargets[0]) || e.target
  },

  /**
   * 从 x, y 点创建一条连接线
   */
  createLinkLine (x, y) {
    return new fabric.LinkLine([x, y, x, y + 1])
  },

  /**
   * 用 line 连接两个点
   */
  linkPoint (point1, point2, line) {
    // 确保总是next连到pre
    if (point1.linkType === 'next') {
      line.linkPoint(point1, point2)
    } else {
      line.linkPoint(point2, point1)
    }
  }
})

fabric.LinkCanvas = LinkCanvas
