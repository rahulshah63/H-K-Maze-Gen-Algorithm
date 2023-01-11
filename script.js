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

    HuntnKill.prototype.getMaze = function () {
      var start =
        this.grid[Math.floor(Math.random() * this.size)][
          Math.floor(Math.random() * this.size)
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
                    neighbors[Math.floor(Math.random() * neighbors.length)]
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
          var next = neighbors[Math.floor(Math.random() * neighbors.length)]
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
    c.width = 2000
    c.height = 2000
    var ctx = c.getContext("2d")
    var huntnKill = new HuntnKill(20)

    var maze = huntnKill.getMaze()
    console.log(maze)
    for (var x = 0; x < maze.length; x++) {
      for (var y = 0; y < maze[x].length; y++) {
        if (maze[x][y]) ctx.fillRect(x * 5, y * 5, 5, 5)
      }
    }
  })
})()
