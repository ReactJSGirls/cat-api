const path = require('path')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { graphqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const expressPlayground = require('graphql-playground-middleware-express')
  .default

const getFiles = require('./src/getFiles')
const getRandom = require('./src/getRandom')

const getOneCat = async (req, placeholder = false) => {
  const files = await getFiles(req, placeholder)
  const randomIndex = Math.floor(Math.random() * files.length)
  const cats = files[randomIndex]

  return cats
}

const typeDefs = `
  type Query {
    # Get One Cat
    cat: String,
    # Get All The Cats
    cats(length: Int): [String]
  }
`

const resolvers = {
  Query: {
    cat: async (_, __, { req }) => getOneCat(req),
    cats: async (_, { length }, { req }) => {
      const files = await getFiles(req)
      return getRandom(files, length)
    }
  }
}

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

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
  .disable('x-powered-by')
  .get('/cat', async (req, res) =>
    res.json({
      cat: await getOneCat(req)
    })
  )
  .get('/placeholder', async (req, res) => {
    const cat = await getOneCat(req, true)

    res.sendFile(cat, { root: '/' })
  })
  .get('/cats/:length', async (req, res) => {
    const length = req.params.length
    const files = await getFiles(req)
    const cats = getRandom(files, length)

    res.json({
      cats
    })
  })
  .get('/', (req, res) => res.sendFile(path.join(__dirname, 'src/index.html')))
  .get('/images/:file', (req, res) =>
    res.sendFile(path.join(__dirname, req.path))
  )

app.listen(3000, () => console.log('Cat API is on http://localhost:3000/'))
