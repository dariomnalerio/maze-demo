import { Cell, Maze } from '../types';

function getNeighbors(cell: Cell, maze: Maze): Cell[] {
  const { x, y } = cell;
  const neighbors: Cell[] = [];

  if (!cell.walls.top && y > 0) neighbors.push(maze[y - 1][x]);
  if (!cell.walls.right && x < maze[0].length - 1) neighbors.push(maze[y][x + 1]);
  if (!cell.walls.bottom && y < maze.length - 1) neighbors.push(maze[y + 1][x]);
  if (!cell.walls.left && x > 0) neighbors.push(maze[y][x - 1]);

  return neighbors;
}

export function getUnvisitedNeighbors({
  cell,
  maze,
  rows,
  cols,
}: {
  cell: Cell;
  maze: Maze;
  rows: number;
  cols: number;
}) {
  const { x, y } = cell;
  const neighbors = [];

  if (y > 0 && !maze[y - 1][x].visited) neighbors.push(maze[y - 1][x]); // Top
  if (x < cols - 1 && !maze[y][x + 1].visited) neighbors.push(maze[y][x + 1]); // Right
  if (y < rows - 1 && !maze[y + 1][x].visited) neighbors.push(maze[y + 1][x]); // Bottom
  if (x > 0 && !maze[y][x - 1].visited) neighbors.push(maze[y][x - 1]); // Left

  return neighbors;
}

export function removeWalls({ current, next }: { current: Cell; next: Cell }) {
  const x = current.x - next.x;
  const y = current.y - next.y;

  if (x === 1) {
    current.walls.left = false;
    next.walls.right = false;
  } else if (x === -1) {
    current.walls.right = false;
    next.walls.left = false;
  }

  if (y === 1) {
    current.walls.top = false;
    next.walls.bottom = false;
  } else if (y === -1) {
    current.walls.bottom = false;
    next.walls.top = false;
  }
}

export async function solveMazeBFS(maze: Maze, start: Cell, end: Cell): Promise<Cell[]> {
  const queue: { cell: Cell; path: Cell[] }[] = [{ cell: start, path: [start] }];
  const visited = new Set<Cell>();
  visited.add(start);

  while (queue.length > 0) {
    const { cell: current, path } = queue.shift() as {
      cell: Cell;
      path: Cell[];
    };

    if (current.x === end.x && current.y === end.y) {
      return path;
    }

    const neighbors = getNeighbors(current, maze);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ cell: neighbor, path: [...path, neighbor] });
      }
    }
  }

  return [];
}