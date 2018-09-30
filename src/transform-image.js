const Jimp = require('jimp')

const errorMessage = res =>
  res.status(500).send({ error: 'There was an error processing the image.' })

const transform = (img, width, height, res) => {
  if (width < 1 || (height < 1 && !Jimp.AUTO)) return errorMessage(res)
  if (!Number.isInteger(width) || (!Number.isInteger(width) && !Jimp.AUTO)) {
    return errorMessage(res)
  }

  return Jimp.read(img).then(cat =>
    cat.resize(width, height).getBuffer(Jimp.MIME_JPEG, (error, stream) => {
      if (error) errorMessage(res)

      res.contentType('image/jpeg')
      res.send(stream)
    })
  )
}
module.exports = transform
