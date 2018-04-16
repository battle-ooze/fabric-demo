const LinkNode = fabric.util.createClass(fabric.Group, {
  type: 'link-node',
  subTargetCheck: true,

  /**
   * 初始化 Node
   * @param {*} option.name 名称
   * @param {*} option.points {linkId, linkType, maxLink, allowLink, uuid}
   */
  initialize (option) {
    this.rect = this.createRect({text: option.name})
    this._points = this.createLinkPoint(option.points, this.rect)

    let group = [this.rect, ...this._points]
    this.callSuper('initialize', group, option)
  },

  createRect ({text}) {
    return new fabric.Group([
      new fabric.Rect({
        originX: 'center',
        originY: 'center',
        fill: '#fff',
        width: 150,
        height: 50,
        rx: 4,
        shadow: { color: '#c2cbd4', blur: 4, offsetY: 1, offsetX: 0 }
      }),
      new fabric.Text(text, {fontSize: 14, originX: 'center', originY: 'center'}),
    ])
  },

  createLinkPoint (points, rect) {
    let result = []
    let positionFlag = {
      pre: { top: -1 },
      next: { top: 1 }
    }

    Object.keys(positionFlag).forEach(position => {
      if (!points[position]) return
      let interval = rect.width / (points[position] + 1)
      for (let i = 0; i < points[position]; i++) {
        result.push(new fabric.Circle({
          radius: 4,
          fill: '#fff',
          strokeWidth: 1,
          stroke: '#d7d8df',
          linkType: position,
          top: positionFlag[position].top * rect.height / 2,
          left: -rect.width / 2 + interval * (i + 1)
        }))
      }
    })
    return result 
  }
})

fabric.LinkNode = LinkNode
