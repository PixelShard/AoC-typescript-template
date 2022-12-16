import Puzzle from '../../types/AbstractPuzzle';
import { StringHelper } from '../../utils/string.helper';
import _ from 'lodash';

export default class ConcretePuzzle extends Puzzle {
    private stringHelper = new StringHelper();
    private grid: string[][];
    private mappedGrid: string[][];
    private ROWS = 0;
    private COLS = 0;
    // private startPosition = [0, 0];
    private startPosition = [20, 0];

    public solveFirst(): string {
        this.grid = this.stringHelper.arrayToTwoDimensions(this.input);
        this.mappedGrid = this.mapGrid(this.grid);
        this.ROWS = this.grid.length;
        this.COLS = this.grid[0].length;
        // this.printGrid(this.grid);
        // this.printGrid(this.mappedGrid);
        // WRITE SOLUTION FOR TEST 1
        // this.loop(this.mappedGrid, this.ROWS, this.COLS);
        return this.loop(this.mappedGrid, this.ROWS, this.COLS).toString();
    }

    public getFirstExpectedResult(): string {
        // RETURN EXPECTED SOLUTION FOR TEST 1;
        return '361';
    }

    public solveSecond(): string {
        // WRITE SOLUTION FOR TEST 2
        let min = 500;
        this.mappedGrid[20][0] = '1';
        this.mappedGrid.map((row, i) => {
            row.map((item, j) => {
                if (+item === 1) {
                    this.startPosition = [i, j];
                    const value = this.loop(this.mappedGrid, this.ROWS, this.COLS, true);
                    min = value && value < min ? value : min;
                }
            });
        });
        return min.toString();
    }

    public getSecondExpectedResult(): string {
        // RETURN EXPECTED SOLUTION FOR TEST 2;
        return '354';
    }

    private loop(heightsMatrix: string[][], row: number, col: number, searchAllPaths?: boolean): number {
        const empty: string[][] = Array.from(Array(row), () => Array(col).fill('_'));
        const visited: string[][] = Array.from(Array(row), () => Array(col).fill('_'));

        // for (let i = 0; i < row; i++) {
        //     for (let j = 0; j < col; j++) {
        //         empty[i][j] = '_';
        //     }
        // }

        // direction arrays for simplification of getting
        // neighbour
        const dx = [-1, 0, 1, 0];
        const dy = [0, 1, 0, -1];

        const st = [];
        let finalSteps = 0;
        empty[this.startPosition[0]][this.startPosition[1]] = '#';
        visited[this.startPosition[0]][this.startPosition[1]] = '#';
        st.push(new cell(this.startPosition[0], this.startPosition[1], false, 1, _.cloneDeep(empty)));
        // loop for standard dijkstra's algorithm
        while (st.length != 0) {
            const k: cell = st[0];
            st.shift();
            // looping through all neighbours
            for (let i = 0; i < 4; i++) {
                const x: number = k.x + dx[i];
                const y: number = k.y + dy[i];

                // if not inside boundary, ignore them
                if (!this.isInsideGrid(x, y)) {
                    continue;
                }

                if (visited[x][y] !== '#' && (
                    (+heightsMatrix[k.x][k.y] === +heightsMatrix[x][y] || +heightsMatrix[k.x][k.y] + 1 === (+heightsMatrix[x][y]))
                    || (+heightsMatrix[x][y]) < +heightsMatrix[k.x][k.y]
                    )
                ) {
                    if (+heightsMatrix[x][y] === 27) {
                        if (!searchAllPaths) {
                            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                            this.printGrid(k.previous);
                            console.log(k.steps);
                            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                        }
                        finalSteps = k.steps;
                        break;
                    }

                    k.previous[x][y] = '#';
                    visited[x][y] = '#';
                    st.push(new cell(x, y, true, k.steps + 1, _.cloneDeep(k.previous)));
                }
            }
        }
        return finalSteps;
    }

    // Utility method to check whether a point is
    // inside the grid or not
    private isInsideGrid(i: number, j: number) {
        return (i >= 0 && i < this.ROWS && j >= 0 && j < this.COLS);
    }

    private mapCost(cell: string): number {
        // console.log(`${cell}  ${+cell.charCodeAt(0) - 96}`);
        return cell === 'S' ? 0 : cell === 'E' ? 27 : +cell.charCodeAt(0) - 96;
    }

    private mapGrid(grid: string[][]): string[][] {
        const mappedGrid = [...grid].map((row) => [...row].map((row) => this.mapCost(row).toString()));
        return mappedGrid;
    }

    private printGrid(grid: string[][] | number[][]) {
        grid.map((row) => {
            console.log(row.toString().replace(/,/g, ''));
        });
        console.log('-----------------------------------------');
    }
}

// structure for information of each cell
class cell {
    public x;
    public y;
    public visited = false;
    public steps = 1;
    public previous: string[][];

    constructor(x: number, y: number, visited: boolean, steps: number, previous: string[][]) {
        this.x = x;
        this.y = y;
        this.visited = visited;
        this.steps = steps;
        this.previous = previous;
    }

    print() {
        this.previous.map((row) => {
            console.log(row.toString().replace(/,/g, ''));
        });
    }
    toString() {
        return this.visited ? '#' : '_';
    }
}
