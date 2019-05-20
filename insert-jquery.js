!function () {
  if (typeof jQuery === 'undefined') {
    const src = 'https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js'
    const script = document.createElement('script')
    script.setAttribute('src', src)
    document.body.appendChild(script)
  }
}()