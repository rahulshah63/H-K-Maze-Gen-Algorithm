;(() => {
  window.addEventListener("load", () => {
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

    window.seed = 63876354379837273
    window.resourceCount = 500

    HuntnKill.prototype.getMaze = function () {
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
          if (!found) return this.buildMaze()
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
      var maze = []
      for (var x = 0; x < this.size * 2 + 1; x++) {
        maze[x] = []
        for (var y = 0; y < this.size * 2 + 1; y++) {
          maze[x][y] = 1
        }
      }

      for (var x = 0; x < this.size; x++) {
        for (var y = 0; y < this.size; y++) {
          if (this.grid[x][y].visited) {
            maze[x * 2 + 1][y * 2 + 1] = 0
            var children = this.grid[x][y].children
            if (children.length === 0 && window.resourceCount > 0) {
              //20% chance
              if (Math.random() < 0.2) {
                window.resourceCount--
                maze[x * 2 + 1][y * 2 + 1] = 2
              }
              continue
            }
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
      return maze
    }

    const getRandom = function (seed, clippingSize) {
      const m = 2147483647,
        a = m / 21,
        b = m / 5
      window.seed = (a * window.seed + b) % m
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
    var c = document.getElementById("canvas")
    c.width = 700
    c.height = 700
    var ctx = c.getContext("2d")
    var huntnKill = new HuntnKill(100)
    const pixels = 3

    var maze = huntnKill.getMaze()
    while (window.resourceCount > 0) {
      //get random node
      var x = Math.floor(Math.random() * maze.length)
      var y = Math.floor(Math.random() * maze[x].length)
      console.log(x, y, maze[x][y], window.resourceCount)
      if (maze[x][y] === 0) {
        maze[x][y] = 2
        window.resourceCount--
      }
    }
    console.log(maze)
    for (var x = 0; x < maze.length; x++) {
      for (var y = 0; y < maze[x].length; y++) {
        if (maze[x][y] === 1) {
          ctx.fillStyle = "black"
          ctx.fillRect(x * pixels, y * pixels, pixels, pixels)
        } else if (maze[x][y] === 0) {
          ctx.fillStyle = "white"
          ctx.fillRect(x * pixels, y * pixels, pixels, pixels)
        } else {
          ctx.fillStyle = "red"
          ctx.fillRect(x * pixels, y * pixels, pixels, pixels)
        }
      }
    }

    //add player
    var player = { x: 1, y: 1 }
    function addPlayer() {
      ctx.fillStyle = "blue"
      ctx.fillRect(player.x * pixels, player.y * pixels, pixels, pixels)
    }
    function removePlayer() {
      ctx.fillStyle = "white"
      ctx.fillRect(player.x * pixels, player.y * pixels, pixels, pixels)
    }
    addPlayer()

    //update player
    function updatePlayer(x, y) {
      if (maze[x][y] == 0) {
        removePlayer()
        player.x = x
        player.y = y
        addPlayer()
      }
    }

    //add event listener
    document.addEventListener("keydown", function (e) {
      if (e.key == "ArrowUp") updatePlayer(player.x, player.y - 1)
      if (e.key == "ArrowDown") updatePlayer(player.x, player.y + 1)
      if (e.key == "ArrowLeft") updatePlayer(player.x - 1, player.y)
      if (e.key == "ArrowRight") updatePlayer(player.x + 1, player.y)
    })

    // //animation loop
    // ;(function loop() {
    //   requestAnimationFrame(loop)
    //   //updatePlayer(player.x, player.y + 1)
    // })()
  })
})()
