import chunks from "./db-mazechunks-epoch2.json" assert { type: "json" }
// import mazeChunk from "./mazeChunk.json" assert { type: "json" }
// import maze from "./maze.json" assert { type: "json" }
import fs from "fs"

const size = 16
const mazeChunk = []
chunks.forEach((chunk) => {
  const x = parseInt(chunk.index.split(",")[0])
  const y = parseInt(chunk.index.split(",")[1])
  //convert to 2d array
  const chunkSplitRaw = chunk.data.match(new RegExp(".{1," + size + "}", "g"))
  console.log(chunkSplitRaw)
  const chunkArrRaw = chunkSplitRaw.map((row) => row.split(""))
  const chunk2d = chunkArrRaw.map((row) => row.map((cell) => parseInt(cell)))
  mazeChunk[x] = mazeChunk[x] || []
  mazeChunk[x][y] = chunk2d
})

//Convert to complete maze 2D array
var temp = []
var mazeBlock = []

for (let x = 0; x < mazeChunk.length; x++) {
  for (let y = 0; y < mazeChunk[x].length; y++) {
    const chunk = mazeChunk[x][y]
    chunk.forEach((row, y) => {
      temp[y] = temp[y] || []
      temp[y] = temp[y].concat(row)
    })
  }
  mazeBlock.push(temp)
  temp = []
}

const maze2D = temp.flat()

// //Save to file
fs.writeFileSync("mazeChunk.json", JSON.stringify(mazeChunk))
fs.writeFileSync("mazeBlock.json", JSON.stringify(mazeBlock))
fs.writeFileSync("maze2D.json", JSON.stringify(maze2D))
