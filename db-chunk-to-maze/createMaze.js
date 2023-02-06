import chunks from "./db-chunk.json" assert { type: "json" }
import fs from "fs"

const size = 16
const mazeChunk = []
chunks.forEach((chunk) => {
  const x = parseInt(chunk.index.split(",")[0])
  const y = parseInt(chunk.index.split(",")[1])
  //convert to 2d array
  const chunkSplitRaw = chunk.data.match(new RegExp(".{1," + size + "}", "g"))
  const chunkArrRaw = chunkSplitRaw.map((row) => row.split(""))
  const chunk2d = chunkArrRaw.map((row) => row.map((cell) => parseInt(cell)))
  mazeChunk[x] = mazeChunk[x] || []
  mazeChunk[x][y] = chunk2d
})

//Convert to complete maze 2D array
var maze = []
var maze2D = []
console.log(mazeChunk.length, mazeChunk[0].length)

mazeChunk.forEach((chunkX) => {
  chunkX.forEach((chunkY) => {
    chunkY.forEach((row, y) => {
      maze[y] = maze[y] || []
      maze[y] = maze[y].concat(row)
    })
  })
  maze2D.push(maze)
})

maze2D = maze2D.flat()

//Save to file
fs.writeFileSync("mazeChunk.json", JSON.stringify(mazeChunk))
fs.writeFileSync("maze.json", JSON.stringify(maze2D))
