!function () {
  const avoidIds = []

  function traverseDom (el, callback) {
    $(el).contents().each(function () {
      if (this.nodeType !== 1) return
      if (avoidIds.includes($(this).attr('id'))) return
      callback(this)
      traverseDom(this, callback)
    })
  }

  const generateId = (function () {
    const prefix = 'anch'
    let index = 0
    return function () {
      const id = `${prefix}${index}`
      index ++
      return id
    }
  })()

  let extractedCss = ''

  traverseDom('body', function (el) {
    const $el = $(el)
    let style = $el.attr('style')
    if (!style) return
    style = style
      .trim()
      .replace(/\s+/g, ' ')
    let id = $el.attr('id')
    if (!id) {
      id = generateId()
      $el.attr({id})
    }
    extractedCss += `#${id}{${style}}\n`
    $el.removeAttr('style')
  })

  console.log(extractedCss)
}()
