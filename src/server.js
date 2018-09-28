import App from "./App"
import React from "react"
import path from "path"
import { StaticRouter } from "react-router-dom"
import express from "express"
import { renderToString } from "react-dom/server"
import fg from "fast-glob"
import cors from "cors"

const IMAGE_BANK_SRC = path.resolve(__dirname, "images/**")

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const getFiles = async req => {
  const fullUrl = req.protocol + "://" + req.get("host")
  const files = await fg([IMAGE_BANK_SRC], {
    transform: entry => fullUrl + entry.split("/build")[1]
  })

  return files
}

const getRandom = (arr, n) => {
  let result = new Array(n)
  let len = arr.length
  let taken = new Array(len)
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available")
  while (n--) {
    const x = Math.floor(Math.random() * len)
    result[n] = arr[x in taken ? taken[x] : x]
    taken[x] = --len in taken ? taken[len] : len
  }

  return result
}

const server = express()
server.use(cors())
server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get("/cat", async (req, res) => {
    const files = await getFiles(req)
    const randomIndex = Math.floor(Math.random() * files.length)
    const cats = files[randomIndex]

    res.json({
      cat: cats
    })
  })
  .get("/cats/:length", async (req, res) => {
    const length = req.params.length
    const files = await getFiles(req)
    const cats = getRandom(files, length)

    res.json({
      cats
    })
  })
  .get("/*", (req, res) => {
    const context = {}
    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    )

    if (context.url) {
      res.redirect(context.url)
    } else {
      res.status(200).send(
        `<!doctype html>
    <html lang="en">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>The Cat API</title>
        <link href="https://fonts.googleapis.com/css?family=Roboto+Mono" rel="stylesheet">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@NikkitaFTW" />
        <meta property="og:url" content="http://bits.blogs.nytimes.com/2011/12/08/a-twitter-for-my-sister/" />
        <meta property="og:title" content="The Cat API" />
        <meta property="og:description" content="An API for all your kitten needs 😸" />


        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ""
        }
        ${
          process.env.NODE_ENV === "production"
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
      )
    }
  })

export default server
