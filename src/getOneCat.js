const getFiles = require('./getFiles')

const getOneCat = async (req, placeholder = false) => {
  const files = await getFiles(req, placeholder)
  const randomIndex = Math.floor(Math.random() * files.length)
  const cats = files[randomIndex]

  return cats
}

module.exports = getOneCat
