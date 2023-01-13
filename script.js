;(() => {
  window.addEventListener("load", () => {
    window.seed = 47

    function HuntnKill(size) {
      this.size = size
      this.grid = []
      for (var x = 0; x < this.size; x++) {
        this.grid[x] = []
        for (var y = 0; y < this.size; y++) {
          this.grid[x][y] = new HKNode(x, y)
        }
      }
    }

    HuntnKill.prototype.getMaze = function () {
      //Execution Time
      console.time("Adding Children node takes : ")
      var start =
        this.grid[Math.floor(getRandom(window.seed, this.size))][
          Math.floor(getRandom(window.seed, this.size))
        ]
      start.visited = true
      var current = start
      while (true) {
        var neighbors = current.getNeighbors(this.grid, this.size)
        if (neighbors.length == 0) {
          // Hunt
          var found = false

          hunt: for (var y = 0; y < this.size; y++) {
            for (var x = 0; x < this.size; x++) {
              var node = this.grid[x][y]
              if (!node.visited) {
                var neighbors = node.getVisitedNeighbors(this.grid, this.size)
                if (neighbors.length != 0) {
                  found = true
                  var neighbor =
                    neighbors[
                      Math.floor(getRandom(window.seed, neighbors.length))
                    ]
                  current = node
                  this.grid[current.x][current.y].visited = true
                  this.grid[neighbor.x][neighbor.y].addChildren(current)
                  break hunt
                }
              }
            }
          }
          if (!found) {
            console.timeEnd("Adding Children node takes : ")
            return this.buildMaze()
          }
        } else {
          // Kill
          var next =
            neighbors[Math.floor(getRandom(window.seed, neighbors.length))]
          current.addChildren(next)
          current = next
          this.grid[current.x][current.y].visited = true
          current.visited = true
        }
      }
    }

    HuntnKill.prototype.buildMaze = function () {
      //Execution Time
      console.time("Building Maze takes : ")
      var maze = []

      //Assign everything as wall
      for (var x = 0; x < this.size * 2 + 1; x++) {
        maze[x] = []
        for (var y = 0; y < this.size * 2 + 1; y++) {
          maze[x][y] = 1
        }
      }

      //Creating Path
      for (var x = 0; x < this.size; x++) {
        for (var y = 0; y < this.size; y++) {
          if (this.grid[x][y].visited) {
            maze[x * 2 + 1][y * 2 + 1] = 0
            var children = this.grid[x][y].children
            for (var child of children) {
              if (child.x < x) {
                maze[x * 2][y * 2 + 1] = 0
              }
              if (child.x > x) {
                maze[x * 2 + 2][y * 2 + 1] = 0
              }
              if (child.y < y) {
                maze[x * 2 + 1][y * 2] = 0
              }
              if (child.y > y) {
                maze[x * 2 + 1][y * 2 + 2] = 0
              }
            }
          }
        }
      }
      console.timeEnd("Building Maze takes : ")
      return maze
    }

    const getRandom = function (seed, clippingSize) {
      const m = 2147483647,
        a = m / 21,
        b = m / 5
      window.seed = (a * seed + b) % m
      return window.seed % clippingSize
    }

    function HKNode(x, y) {
      this.x = x
      this.y = y
      this.visited = false
      this.children = []
    }

    HKNode.prototype.addChildren = function (node) {
      this.children.push(node)
    }

    HKNode.prototype.getNeighbors = function (grid, size) {
      var neighbors = []
      if (this.x > 0 && !grid[this.x - 1][this.y].visited) {
        neighbors.push(grid[this.x - 1][this.y])
      }
      if (this.x < size - 1 && !grid[this.x + 1][this.y].visited) {
        neighbors.push(grid[this.x + 1][this.y])
      }
      if (this.y > 0 && !grid[this.x][this.y - 1].visited) {
        neighbors.push(grid[this.x][this.y - 1])
      }
      if (this.y < size - 1 && !grid[this.x][this.y + 1].visited) {
        neighbors.push(grid[this.x][this.y + 1])
      }
      return neighbors
    }

    HKNode.prototype.getVisitedNeighbors = function (grid, size) {
      var neighbors = []
      if (this.x > 0 && grid[this.x - 1][this.y].visited) {
        neighbors.push(grid[this.x - 1][this.y])
      }
      if (this.x < size - 1 && grid[this.x + 1][this.y].visited) {
        neighbors.push(grid[this.x + 1][this.y])
      }
      if (this.y > 0 && grid[this.x][this.y - 1].visited) {
        neighbors.push(grid[this.x][this.y - 1])
      }
      if (this.y < size - 1 && grid[this.x][this.y + 1].visited) {
        neighbors.push(grid[this.x][this.y + 1])
      }
      return neighbors
    }

    //This stuff doesn't matter, it's only here to make the snippet runnable.
    console.time("Total Time taken : ")
    var c = document.getElementById("canvas")
    c.width = 1000
    c.height = 1000
    var ctx = c.getContext("2d")

    //Generating Maze in chunks
    const huntnKill = []
    const size = 100
    const chunk = 5
    for (var u = 0; u < chunk; u++) {
      huntnKill[u] = []
      for (var v = 0; v < chunk; v++) {
        console.log(window.seed)
        huntnKill[u][v] = new HuntnKill(size)
        const maze = huntnKill[u][v].getMaze()
        const condition = u * chunk + v
        let x, y

        if (condition == 0) {
          //Top Left
          for (x = 0; x < maze.length - 1; x++) {
            for (y = 0; y < maze[x].length - 1; y++) {
              if (maze[x][y]) {
                ctx.fillRect(
                  x + v * 2 * size - v * 2,
                  y + u * 2 * size - u * 2,
                  1,
                  1
                )
              }
            }
          }
        } else if (condition == chunk - 1) {
          //Top Right
          for (x = 1; x < maze.length; x++) {
            for (y = 0; y < maze[x].length - 1; y++) {
              if (maze[x][y]) {
                ctx.fillRect(
                  x + v * 2 * size - v * 2,
                  y + u * 2 * size - u * 2,
                  1,
                  1
                )
              }
            }
          }
        } else if (condition == chunk * chunk - chunk) {
          //Bottom Left
          for (x = 0; x < maze.length - 1; x++) {
            for (y = 1; y < maze[x].length; y++) {
              if (maze[x][y]) {
                ctx.fillRect(
                  x + v * 2 * size - v * 2,
                  y + u * 2 * size - u * 2,
                  1,
                  1
                )
              }
            }
          }
        } else if (condition == chunk * chunk - 1) {
          //Bottom Right
          for (x = 1; x < maze.length; x++) {
            for (y = 1; y < maze[x].length; y++) {
              if (maze[x][y]) {
                ctx.fillRect(
                  x + v * 2 * size - v * 2,
                  y + u * 2 * size - u * 2,
                  1,
                  1
                )
              }
            }
          }
        } else if (u == 0) {
          //Top
          for (x = 1; x < maze.length - 1; x++) {
            for (y = 0; y < maze[x].length - 1; y++) {
              if (maze[x][y]) {
                ctx.fillRect(
                  x + v * 2 * size - v * 2,
                  y + u * 2 * size - u * 2,
                  1,
                  1
                )
              }
            }
          }
        } else if (u == chunk - 1) {
          //Bottom
          for (x = 1; x < maze.length - 1; x++) {
            for (y = 1; y < maze[x].length; y++) {
              if (maze[x][y]) {
                ctx.fillRect(
                  x + v * 2 * size - v * 2,
                  y + u * 2 * size - u * 2,
                  1,
                  1
                )
              }
            }
          }
        } else if (v == 0) {
          //Left
          for (x = 0; x < maze.length - 1; x++) {
            for (y = 1; y < maze[x].length - 1; y++) {
              if (maze[x][y]) {
                ctx.fillRect(
                  x + v * 2 * size - v * 2,
                  y + u * 2 * size - u * 2,
                  1,
                  1
                )
              }
            }
          }
        } else if (v == chunk - 1) {
          //Right
          for (x = 1; x < maze.length; x++) {
            for (y = 1; y < maze[x].length - 1; y++) {
              if (maze[x][y]) {
                ctx.fillRect(
                  x + v * 2 * size - v * 2,
                  y + u * 2 * size - u * 2,
                  1,
                  1
                )
              }
            }
          }
        } else {
          //Middle
          for (x = 1; x < maze.length - 1; x++) {
            for (y = 1; y < maze[x].length - 1; y++) {
              if (maze[x][y]) {
                ctx.fillRect(
                  x + v * 2 * size - v * 2,
                  y + u * 2 * size - u * 2,
                  1,
                  1
                )
              }
            }
          }
        }
      }
    }

    console.timeEnd("Total Time taken : ")
  })
})()
