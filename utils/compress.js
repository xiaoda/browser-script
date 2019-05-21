#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const argv = require('yargs').argv

;(() => {
  const srcFilePath = process.argv[2]
  let fileContent = fs.readFileSync(srcFilePath, {
    encoding: 'utf8'
  })
  const replaceStrResult = replaceStr(fileContent)
  const strList = replaceStrResult.strList
  fileContent = replaceStrResult.content
  fileContent = compress(fileContent)
  fileContent = recoverStr(fileContent, strList)

  const distFilePath = argv.output
  fs.writeFileSync(distFilePath, fileContent)
})()

function compress (content) {
  return content
    /* Remove white spaces */
    .replace(/\s+([\n\(\)\{\}\=\:\.\,\'\"])/g, (match, p1) => p1)
    .replace(/([\n\(\)\{\}\=\:\.\,\'\"])[ \f\r\t\v]+/g, (match, p1) => p1)
    /* Remove annotations */
    .replace(/\/\*[\s\S]+?\*\//, '')
    .replace(/\/\/[\s\S]+?\n/, '\n')
    /* Remove new lines */
    .replace(/(.)\n(.)/g, (match, p1, p2) => {
      const withSeparator = `${p1};${p2}`
      const withoutSeparator = `${p1}${p2}`
      if (/[\(\{\=\:\,]/.test(p1)) {
        return withoutSeparator
      } else if (/\./.test(p2)) {
        return withoutSeparator
      } else {
        return withSeparator
      }
    })
}

function replaceStr (content) {
  const strList = []
  let i = 0, n = content.length
  while (i < n) {
    const char = content[i]
    if (['\'', '"', '`'].includes(char)) {
      const closeIndex = content.slice(i + 1).indexOf(char)
      const strContent = content.substr(i, closeIndex + 2)
      content = content.replace(strContent, `#${strList.length}#`)
      n = content.length
      i = i + 1 + `#${strList.length}#`.length
      strList.push(strContent)
    } else {
      i++
    }
  }
  return {content, strList}
}

function recoverStr (content, strList) {
  strList.forEach((value, index) => {
    content = content.replace(`#${index}#`, value)
  })
  return content
}
