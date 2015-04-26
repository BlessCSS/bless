path = require "path"

importer = (options) ->
  {output, suffix, numFiles} = options
  return "" if numFiles <= 1

  imports = []

  for index in [1...numFiles]
    dirname = path.dirname output
    extension = path.extname output
    filename = path.basename output, extension
    imports.push "./#{filename}-#{suffix}-#{index}#{extension}"

  statements = ("@import(\"#{item}\");" for item in imports)
  statements.join "\n"

module.exports = importer
