import Puzzle from '../../types/AbstractPuzzle';
import { StringHelper } from '../../utils/string.helper';

export default class ConcretePuzzle extends Puzzle {
  private stringHelper = new StringHelper();
  private grid: string[][];
  private rowLength = 0;
  private columnLength = 0;
  private treesCount = 0;
  private map: string[][];
  private scoreMap: number[][];

  public solveFirst(): string {
    // WRITE SOLUTION FOR TEST 1
    this.grid = this.stringHelper.arrayToTwoDimensions(this.input);
    this.rowLength = this.grid[0].length;
    this.columnLength = this.grid.length;
    this.map = new Array(this.columnLength);
    for (let i=0;i<this.columnLength;i++) {
      this.map[i] = new Array(this.rowLength).fill('-');
    }
    this.scoreMap = new Array(this.columnLength);
    for (let i=0;i<this.columnLength;i++) {
      this.scoreMap[i] = new Array(this.rowLength).fill('-');
    }

    this.watchDirectionFromTree('rows', false, false); // TOP view
    this.watchDirectionFromTree('rows', true, false); // Bottom view
    this.watchDirectionFromTree('columns', false, false); // Left view
    this.watchDirectionFromTree('columns', false, true); // Left view

    this.printMap(this.map);
    this.countMap();
    return this.treesCount.toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '1705';
  }

  public solveSecond(): string {
    // WRITE SOLUTION FOR TEST 2
    // this.printMap(this.scoreMap);
    const max = Math.max(...this.scoreMap.flat());
    return max.toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '371200';
  }

  private watchDirectionFromTree(type: string, revertRow: boolean, revertColumn: boolean): void {
    for (let row = revertRow ? this.columnLength: 0; revertRow ? row >= 0 : row < this.columnLength; revertRow ? row-- : row++) {
      for (let column = revertColumn ? this.rowLength : 0; revertColumn ? column >= 0 : column < this.rowLength; revertColumn ? column-- : column++) {
        let canShow = true;
        let beforeBlock = 0;
        if (type === 'rows') {
          if ((!revertRow && row === 0 || revertRow && row === this.columnLength - 1)) { // first line always visible
            this.map[row][column] = 'o';
            this.scoreMap[row][column] = 0;
          }
          if (!revertRow && row > 0 || revertRow && row < this.columnLength - 1) {
            for (let x = !revertRow ? row-1 : row+1; !revertRow ? x >= 0 : x<= this.columnLength - 1; !revertRow ? x-- : x++) {
              if (this.grid[x][column] >= this.grid[row][column]) {
                canShow = false;
                beforeBlock+=1;
                break;
              } else {
                beforeBlock+=1;
              }
            }
            if (canShow) {
              this.map[row][column] = 'o';
            }
            this.scoreMap[row][column] = !revertRow ? beforeBlock : this.scoreMap[row][column]*beforeBlock;
          }
        }
        if (type === 'columns') {
          if ((!revertColumn && column === 0 || revertColumn && column === this.rowLength - 1) && row > 0 && row < this.columnLength - 1) {
            this.map[row][column] = 'o';
            this.scoreMap[row][column] = 0;
          }
          if (!revertColumn && column > 0 || revertColumn && column < this.rowLength - 1) {
            for (let x = !revertColumn ? column-1 : column+1; !revertColumn ? x >= 0 : x <= this.rowLength - 1; !revertColumn ? x-- : x++) {
              if (this.grid[row][x] >= this.grid[row][column]) {
                canShow = false;
                beforeBlock+=1;
                break;
              } else {
                beforeBlock+=1;
              }
            }
            if (canShow) {
              this.map[row][column] = 'o';
            }
            this.scoreMap[row][column] = this.scoreMap[row][column]*beforeBlock;
          }
        }
      }
    }
  }

  private printMap(map: any[][]) {
    map.map(row => {
      console.log(row.toString().replace(/,/g, ''));
    });
  }

  private countMap() {
    this.map.map(row => {
        row.map(value => {
          if (value === 'o') {
            this.treesCount+=1;
          }
        });
    });
  }
}
