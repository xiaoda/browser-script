!function () {
  const OPTIONS = {
    pagesNumber: 5
  }
  let searchResultList = []
  let requestCount = 0

  function getSearchResult (url, index) {
    $.get(url, {
      page: index + 1
    }).done((data) => {
      const $html = $(data)
      $html.find('.main-left .news-list > li').each(function () {
        const $parent = $('<div>')
        $parent.append($(this))
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
    }).always(_ => {
      requestCount++
      if (requestCount === OPTIONS.pagesNumber) render()
    })
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
    $('body').append(`<div id="xiaodaLoading" style="position: fixed; right: 10px; bottom: 10px;">Loading...</div>`)
  }

  function hideLoading () {
    $('#xiaodaLoading').remove()
  }

  function init () {
    showLoading()
    const url = window.location.href
    for (let i = 0; i < OPTIONS.pagesNumber; i++) {
      setTimeout(_ => {
        getSearchResult(url, i)
      }, i * 1500 + Math.random() * 500)
    }
  }

  init()
}()
