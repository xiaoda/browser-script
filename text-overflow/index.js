!function () {
  const CUSTOM_OPTIONS = typeof TEXT_OVERFLOW_OPTIONS === 'undefined' ? {} : TEXT_OVERFLOW_OPTIONS
  const OPTIONS = {
    textRepeatTimes: 3,
    avoidSelectors: [],
    avoidText: [],
    ...CUSTOM_OPTIONS
  }

  function traverseDom (el, callback) {
    const excludeTags = ['IFRAME', 'STYLE', 'SCRIPT', 'NOSCRIPT']
    if (excludeTags.includes(el.tagName)) return
    $(el).contents().each(function () {
      if (OPTIONS.avoidSelectors.some(selector => !!$(this).closest(selector).length)) return
      switch (this.nodeType) {
        case 1:
          traverseDom(this, callback)
          break
        case 3:
          callback(this)
          break
      }
    })
  }

  traverseDom('body', function (el) {
    const text = $(el).text().replace(/^\s+/, '').replace(/\s+$/, '')
    if (!text) return
    else if (OPTIONS.avoidText.includes(text)) return
    $(el).replaceWith(text.repeat(OPTIONS.textRepeatTimes))
  })
}()
