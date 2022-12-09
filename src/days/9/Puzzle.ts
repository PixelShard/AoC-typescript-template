import Puzzle from '../../types/AbstractPuzzle';
import {StringHelper} from '../../utils/string.helper';

interface IPosition {H: boolean; T: boolean, s: boolean}
export default class ConcretePuzzle extends Puzzle {
  private stringHelper = new StringHelper();
  private positions: {H: number[], T: number[], s: number[]};
  private diagram: Position[][] = [];

  public solveFirst(): string {
    // WRITE SOLUTION FOR TEST 1
    this.positions = { H: [0, 0], T: [0, 0], s: [0, 0] };
    this.diagram[0] = [new Position(true, true, true)];
    // this.printDiagram(this.diagram);
    this.stringHelper.stringIntoArray(this.input).map(command => {
      this.doMove(command);
    });
    // console.log('<<<<<<<<------------------------------->>>>>>>>');
    // this.printDiagram(this.diagram);
    // this.countDiagram(this.diagram);
    return this.countDiagram(this.diagram);
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '6037';
  }

  public solveSecond(): string {
    // WRITE SOLUTION FOR TEST 2
    return 'day 1 solution 2';
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return 'day 1 solution 2';
  }

  private doMove(move: string) {
    if (!move.length) {
      return;
    }
    let [direction, count] = move.split(/\s/);
      switch (direction) {
        case 'U':
          // console.log('==== UP ====');
          if (this.positions.H[0] === 0) {
            this.diagram.unshift(new Array(this.diagram[0].length));
            for (let i = 0; i < this.diagram[0].length; i++) {
              this.diagram[0][i] = new Position(false, false, false);
            }
            this.diagram[1][this.positions.H[1]].H = false;
            this.diagram[this.positions.H[0]][this.positions.H[1]].H = true;
            this.positions.T[0] += 1;
            this.positions.s[0] += 1;
          } else {
            this.diagram[this.positions.H[0]][this.positions.H[1]].H = false;
            this.positions.H[0] -= 1;
            this.diagram[this.positions.H[0]][this.positions.H[1]].H = true;
          }
          break;
        case 'R':
          // console.log('==== RIGHT ====');
          if (this.positions.H[1] === this.diagram[this.positions.H[0]].length - 1) {
            this.diagram.map(row => {
              row.push(new Position(false, false, false));
            });
          }
          this.diagram[this.positions.H[0]][this.positions.H[1]].H = false;
          this.positions.H[1] += 1;
          this.diagram[this.positions.H[0]][this.positions.H[1]].H = true;
          break;
        case 'D':
          // console.log('==== DOWN ====');
          if (this.positions.H[0] === this.diagram.length - 1) {
            this.diagram.push(new Array(this.diagram[0].length));
            for (let i = 0; i < this.diagram[0].length; i++) {
              this.diagram[this.diagram.length - 1][i] = new Position(false, false, false);
            }
          }
          this.diagram[this.positions.H[0]][this.positions.H[1]].H = false;
          this.positions.H[0] += 1;
          this.diagram[this.positions.H[0]][this.positions.H[1]].H = true;
          break;
        case 'L':
          // console.log('==== LEFT ====');
          if (this.positions.H[1] === 0) {
            this.diagram.map(row => {
              row.unshift(new Position(false, false, false));
            });
            this.diagram[this.positions.H[0]][1].H = false;
            this.diagram[this.positions.H[0]][0].H = true;
            this.positions.T[1] += 1;
            this.positions.s[1] += 1;
          } else {
            this.diagram[this.positions.H[0]][this.positions.H[1]].H = false;
            this.positions.H[1] -= 1;
            this.diagram[this.positions.H[0]][this.positions.H[1]].H = true;
          }
          break;
      }

      // this.printDiagram(this.diagram);
      this.checkTailTouchingHead();
      // console.log('************************************************')
      // this.printDiagram(this.diagram);
      if (+count - 1 > 0) {
        this.doMove(`${direction} ${+count - 1}`);
      }
  }

  private checkTailTouchingHead() {
    if (Math.abs(this.positions.T[0] - this.positions.H[0]) > 1) { // VERT
      // console.log('TAIL NEEDS TO MOVE VERT !!!!');
      this.diagram[this.positions.T[0]][this.positions.T[1]].T = false;
      if (this.positions.T[1] !== this.positions.H[1]) {
        this.positions.T[1] < this.positions.H[1] ? this.positions.T[1] += 1 : this.positions.T[1] -= 1;
      }
      this.positions.T[0] < this.positions.H[0] ? this.positions.T[0] += 1 : this.positions.T[0] -= 1;
      this.diagram[this.positions.T[0]][this.positions.T[1]].T = true;
      this.diagram[this.positions.T[0]][this.positions.T[1]].tailWasHere = true;
    }
    if (Math.abs(this.positions.T[1] - this.positions.H[1]) > 1) { // HORIZ
      // console.log('TAIL NEEDS TO MOVE HORIZ !!!!');
      this.diagram[this.positions.T[0]][this.positions.T[1]].T = false;
      if (this.positions.T[0] !== this.positions.H[0]) {
        this.positions.T[0] < this.positions.H[0] ? this.positions.T[0] += 1 : this.positions.T[0] -= 1;
      }
      this.positions.T[1] < this.positions.H[1] ? this.positions.T[1] += 1 : this.positions.T[1] -= 1;
      this.diagram[this.positions.T[0]][this.positions.T[1]].T = true;
      this.diagram[this.positions.T[0]][this.positions.T[1]].tailWasHere = true;
    }
  }

  private printDiagram(diagram: Position[][]) {
    diagram.map(row => {
      console.log(row.toString().replace(/,/g, ''));
    });
  }

  private countDiagram(diagram: Position[][]): string {
    let count = 1; // s
    diagram.map(row => {
      row.map((position) => {
        if (position.tailWasHere) {
          count += 1;
        }
      });
    });
    return count.toString();
  }
}

class Position {
  public H = false; // HEAD
  public T = false; // TAIL
  public s = false; // start
  public tailWasHere = false;

  constructor(T: boolean, H: boolean, s: boolean) {
    this.H = H;
    this.T = T;
    this.s = s;
  }

  public toString():string {
    // return this.tailWasHere this.H ? 'H' : this.T ? 'T' : this.s ? 's' : '.';
    return this.tailWasHere ? '#' : this.H ? 'H' : this.T ? 'T' : this.s ? 's' : '.';
  }
}
