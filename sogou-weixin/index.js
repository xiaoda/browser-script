!function () {
  const OPTIONS = {
    pagesNumber: 5
  }
  let searchResultList = []
  let requestCount = 0

  function getSearchResult (url) {
    function _doneCallback (html) {
      $(html).find('.main-left .news-list > li').each(function () {
        const $parent = $('<div>')
        $parent.append($(this).clone())
        const dateSelector = '.txt-box .s-p .s2'
        const date = $parent.find(dateSelector).text().match(/\d+/)[0]
        $parent.find(dateSelector).empty().text(
          String(new Date(date * 1000)).split(' ').slice(1, 5).join(' ')
        )
        searchResultList.push({
          date,
          html: $parent.html()
        })
      })
    }
    function _alwaysCallback () {
      requestCount++
      if (requestCount === OPTIONS.pagesNumber) render()
    }
    /*
    const _window = window.open(url)
    $(_window.document).ready(_ => {
      setTimeout(_ => {
        _doneCallback($(_window.document))
        setTimeout(_ => {
          _window.close()
          _alwaysCallback()
        }, 100)
      }, 10)
    })
    */
    $.get(url).done(_doneCallback).always(_alwaysCallback)
  }

  function render () {
    sortSearchResults()
    $('.main-left .news-list').empty()
    searchResultList.forEach(result => {
      $('.main-left .news-list').append(result.html)
    })
    hideLoading()
  }

  function sortSearchResults () {
    const tempResultList = []
    const dateList = searchResultList.map(result => Number(result.date))
    dateList.sort().reverse()
    dateList.forEach(date => {
      tempResultList.push(searchResultList.find(result => result.date == date))
    })
    searchResultList = tempResultList
  }

  function showLoading () {
    $('body').append(`<div id="xiaodaStatus" style="position: fixed; right: 10px; bottom: 10px;">Loading...</div>`)
  }

  function hideLoading () {
    $('#xiaodaStatus').text('Done.')
    $('#pagebar_container').remove()
  }

  function init () {
    showLoading()
    const baseUrl = window.location.href
    for (let i = 0; i < OPTIONS.pagesNumber; i++) {
      const url = `${baseUrl.replace(/&page=\d+/, '')}&page=${i+1}`
      setTimeout(_ => {
        getSearchResult(url)
      }, i * 1500 + Math.random() * 500)
    }
  }

  init()
}()
