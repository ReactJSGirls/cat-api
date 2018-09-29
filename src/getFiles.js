const fg = require('fast-glob')
const path = require('path')

module.exports = async (req, placeholder = false) => {
  const IMAGE_BANK_SRC = path.resolve(__dirname, '../images/**')
  const fullUrl = req.protocol + '://' + req.get('host')
  const files = async placeholder =>
    await fg([IMAGE_BANK_SRC], {
      transform: entry =>
        placeholder ? entry : `${fullUrl}/images${entry.split('/images')[1]}`
    })

  return files(placeholder)
}
