const path = require("path")
const express = require("express")
const fg = require("fast-glob")
const cors = require("cors")

const IMAGE_BANK_SRC = path.resolve(__dirname, "images/**")

const getFiles = async (req, placeholder = false) => {
  const fullUrl = req.protocol + "://" + req.get("host")
  const files = async placeholder =>
    await fg([IMAGE_BANK_SRC], {
      transform: entry =>
        placeholder ? entry : fullUrl + entry.split("/cat-api")[1]
    })

  return files(placeholder)
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

const app = express()
app.use(express.static(path.join(__dirname, "src")))
app.use(express.static(path.resolve(__dirname, "images")))
app.use(cors())
app
  .disable("x-powered-by")
  .get("/cat", async (req, res) => {
    const files = await getFiles(req)
    const randomIndex = Math.floor(Math.random() * files.length)
    const cats = files[randomIndex]

    res.json({
      cat: cats
    })
  })
  .get("/placeholder", async (req, res) => {
    const files = await getFiles(req, true)
    const randomIndex = Math.floor(Math.random() * files.length)
    const cat = files[randomIndex]

    res.sendFile(cat, { root: "/" })
  })
  .get("/cats/:length", async (req, res) => {
    const length = req.params.length
    const files = await getFiles(req)
    const cats = getRandom(files, length)

    res.json({
      cats
    })
  })
  .get("/", (req, res) => res.sendFile(path.join(__dirname, "src/index.html")))
  .get("/images/:file", (req, res) =>
    res.sendFile(path.join(__dirname, req.path))
  )

app.listen(3000, () => console.log("Cat API is on http://localhost:3000/"))
