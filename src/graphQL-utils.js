const { makeExecutableSchema } = require('graphql-tools')
const getRandom = require('./getRandom')
const getFiles = require('./getFiles')
const { getOneCat } = require('../server')
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
      const l = length > files.length ? files.length : length

      return getRandom(files, l)
    }
  }
}

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

module.exports = schema
