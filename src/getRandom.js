const getRandom = (arr, n) => {
  if (n < 0) return
  let result = new Array(n)
  let len = arr.length
  let taken = new Array(len)
  while (n--) {
    const x = Math.floor(Math.random() * len)
    result[n] = arr[x in taken ? taken[x] : x]
    taken[x] = --len in taken ? taken[len] : len
  }

  return result
}

module.exports = getRandom
