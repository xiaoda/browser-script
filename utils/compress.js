#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const argv = require('yargs').argv

;(() => {
  const srcFilePath = process.argv[2]
  let fileContent = fs.readFileSync(srcFilePath, {
    encoding: 'utf8'
  })
  fileContent = removeAnnotations(fileContent)
  const replaceStrResult = replaceStr(fileContent)
  fileContent = compress(replaceStrResult.content)
  fileContent = recoverStr(fileContent, replaceStrResult.strList)

  const distFilePath = srcFilePath.replace(/\.js$/, '.min.js')
  fs.writeFileSync(distFilePath, fileContent, {
    encoding: 'utf8'
  })
})()

function removeAnnotations (content) {
  return content
    .replace(/\/\*[^\/\*]*\*\//g, '')
    .replace(/\/\/[^\n]*\n/g, '')
}

function compress (content) {
  return content
    /* Remove blank characters */
    .replace(/\s+([\n\(\)\{\}\[\]\=\>\<\:\;\.\,\?\!\+\-\*\/])/g, (match, p) => p) // From front
    .replace(/([\n\(\{\[\=\>\<\:\;\.\,\?\!])\s+/g, (match, p) => p) // From behind, remove new line
    .replace(/([\)\}\]\+\-\*\/])[ \f\r\t\v]+/g, (match, p) => p) // From behind, reserve new line

    /* Remove new lines from very beginning & end */
    .replace(/^\n+/, '')
    .replace(/\n+$/, '')

    /* Remove new lines & add semicolons */
    .replace(/\n/g, ';')
}

function replaceStr (content) {
  const strList = []
  let i = 0, n = content.length
  while (i < n) {
    const char = content[i]
    if (['\'', '"', '`', '/'].includes(char)) {
      const endIndex = content.slice(i + 1).indexOf(char)
      const strContent = content.substr(i, endIndex + 2)
      content = content.replace(strContent, `#${strList.length}#`)
      n = content.length
      i = i + 1 + `#${strList.length}#`.length
      strList.push(strContent.replace(/\n/g, ' ').replace(/ +/g, ' '))
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
