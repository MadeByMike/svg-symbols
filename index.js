#!/usr/bin/env node
var fs = require('fs')
var path = require('path')
var dom = require('cheerio')
var args = process.argv.slice(2)
var $ = dom.load('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" style="display:none;"></svg>')
var dir
var file
var fileName
var svgNode
var symbolNode
if (args && args.length) {
  dir = args[0]
  fs.readdir(dir, function(err, files) {
    if (err) {
      process.stderr(err)
      return
    }
    files.forEach(function(file) {
      if (path.extname(file) === '.svg') {
        fileName = file.slice(0, -4)
        file = fs.readFileSync(path.join(dir, file), 'utf8')
        svgNode = $(file)
        symbolNode = $('<symbol></symbol>')
        symbolNode.attr('viewbox', svgNode.attr('viewbox'))
        symbolNode.attr('id', fileName)
        symbolNode.append(svgNode.contents())
        symbolNode
          .children()
          .each(
            function(i, kid) {
              $(kid)
                .removeAttr('fill')
                .removeAttr('stroke')
            }
          )
        $('svg').append(symbolNode)
      }
    })
    process.stdout.write($.html())
  })
}
else {
  process.stderr('Directory not found.')
}
