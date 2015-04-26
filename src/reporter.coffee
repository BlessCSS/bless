formatNumber = do require 'format-number'
pluralize = require 'pluralize'

reporter = (options) ->
  {numSelectors, numFiles} = options

  message = []
  message.push "Input file contained #{formatNumber(numSelectors)} #{pluralize('selector', numSelectors)}."

  if numFiles > 1
    message.push "#{formatNumber(numFiles)} #{pluralize('file', numFiles)} created."
  else
    message.push 'No changes made.'

  message.join ' '

module.exports = reporter
