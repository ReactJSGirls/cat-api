const path = require('path')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { graphqlExpress } = require('apollo-server-express')
const expressPlayground = require('graphql-playground-middleware-express')
  .default
const { AUTO } = require('jimp')

const transformImage = require('./src/transform-image')
const getFiles = require('./src/getFiles')
const getRandom = require('./src/getRandom')
const schema = require('./src/graphQL-utils')

const getOneCat = async (req, placeholder = false) => {
  const files = await getFiles(req, placeholder)
  const randomIndex = Math.floor(Math.random() * files.length)
  const cats = files[randomIndex]

  return cats
}

const index = path.join(__dirname, 'src/index.html')

const app = express()
app.use(express.static(path.join(__dirname, 'src')))
app.use(express.static(path.resolve(__dirname, 'images')))
app.use(cors())

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: { req }
  }))
)

// GraphiQL, a visual editor for queries
app.use('/graphiql', expressPlayground({ endpoint: '/graphql' }))
app
  .get('/cat', async (req, res) =>
    res.json({
      cat: await getOneCat(req)
    })
  )
  .get('/placeholder', async (req, res) => {
    const cat = await getOneCat(req, true)

    res.sendFile(cat, { root: '/' })
  })
  .get('/placeholder/:width', async (req, res) => {
    const width = parseInt(req.params.width, 10)
    const cat = await getOneCat(req)

    return transformImage(cat, width, AUTO, res)
  })

  .get('/placeholder/:width/:height', async (req, res) => {
    const width = parseInt(req.params.width, 10)
    const height = parseInt(req.params.height, 10)

    const cat = await getOneCat(req)

    return transformImage(cat, width, height, res)
  })
  .get('/cats/:length', async (req, res) => {
    const files = await getFiles(req)
    const length =
      req.params.length > files.length ? files.length : req.params.length
    const cats = getRandom(files, length)

    if (length < 1) {
      res.status(500).send({ error: 'You need to ask for at least one cat' })
    }

    res.json({
      cats
    })
  })
  .get('/', (_, res) => res.sendFile(index))
  .get('/images/:file', (req, res) => {
    res.sendFile(path.join(__dirname, req.path))
  })

app.listen(3000, () => console.log('Cat API is on http://localhost:3000/'))

module.exports = {
  getOneCat
}
