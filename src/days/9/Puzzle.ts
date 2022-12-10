import Puzzle from '../../types/AbstractPuzzle';
import { StringHelper } from '../../utils/string.helper';

export default class ConcretePuzzle extends Puzzle {
  private stringHelper = new StringHelper();
  private positions: {stack: number[][], s: number[]};
  private diagram: Position[][] = [];

  public solveFirst(): string {
    // WRITE SOLUTION FOR TEST 1
    this.positions = { stack: [[0, 0], [0, 0]], s: [0, 0] };
    this.diagram[0] = [new Position(['T', 'H'], true)];
    // this.printDiagram(this.diagram);
    this.stringHelper.stringIntoArray(this.input).map(command => {
      this.doMove(command);
    });
    // console.log('<<<<<<<<------------------------------->>>>>>>>');
    // this.printDiagram(this.diagram);
    return this.countDiagram(this.diagram);
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '6037';
  }

  public solveSecond(): string {
    // WRITE SOLUTION FOR TEST 2
    this.diagram = [];
    this.positions = {
      stack: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
      s: [0, 0]
    };
    this.diagram[0] = [new Position(['9', '8', '7', '6', '5', '4', '3', '2', '1', 'H'], true)];
    this.stringHelper.stringIntoArray(this.input).map(command => {
      this.doMove(command);
    });
    this.printDiagram(this.diagram);
    return this.countDiagram(this.diagram);
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '2485';
  }

  private doMove(move: string) {
    if (!move.length) {
      return;
    }
    let [direction, count] = move.split(/\s/);
    switch (direction) {
      case 'U':
        // console.log('==== UP ====');
        if (this.getHead()[0] === 0) {
          this.diagram.unshift(new Array(this.diagram[0].length));
          for (let i = 0; i < this.diagram[0].length; i++) {
            this.diagram[0][i] = new Position([], false);
          }
          this.diagram[1][this.getHead()[1]].STACK.pop();
          this.diagram[this.getHead()[0]][this.getHead()[1]].STACK.push('H');
          this.positions.stack.map((pos, i) => {
            if (i < this.positions.stack.length -1) {
              pos[0] += 1;
            }
          });
          this.positions.s[0] += 1;
        } else {
          this.diagram[this.getHead()[0]][this.getHead()[1]].STACK.pop();
          this.getHead()[0] -= 1;
          this.diagram[this.getHead()[0]][this.getHead()[1]].STACK.push('H');
        }
        break;
      case 'R':
        // console.log('==== RIGHT ====');
        if (this.getHead()[1] === this.diagram[this.getHead()[0]].length - 1) {
          this.diagram.map(row => {
            row.push(new Position([], false));
          });
        }
        this.diagram[this.getHead()[0]][this.getHead()[1]].STACK.pop();
        this.getHead()[1] += 1;
        this.diagram[this.getHead()[0]][this.getHead()[1]].STACK.push('H');
        break;
      case 'D':
        // console.log('==== DOWN ====');
        if (this.getHead()[0] === this.diagram.length - 1) {
          this.diagram.push(new Array(this.diagram[0].length));
          for (let i = 0; i < this.diagram[0].length; i++) {
            this.diagram[this.diagram.length - 1][i] = new Position([], false);
          }
        }
        this.diagram[this.getHead()[0]][this.getHead()[1]].STACK.pop();
        this.getHead()[0] += 1;
        this.diagram[this.getHead()[0]][this.getHead()[1]].STACK.push('H');
        break;
      case 'L':
        // console.log('==== LEFT ====');
        if (this.getHead()[1] === 0) {
          this.diagram.map(row => {
            row.unshift(new Position([], false));
          });
          this.diagram[this.getHead()[0]][1].STACK.pop();
          this.diagram[this.getHead()[0]][0].STACK.push('H');
          this.positions.stack.map((pos, i) => {
            if (i < this.positions.stack.length -1) {
              pos[1] += 1;
            }
          });
          this.positions.s[1] += 1;
        } else {
          this.popHead();
          this.getHead()[1] -= 1;
          this.pushHead();
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

  private getHead(): number[] {
    return this.positions.stack[this.positions.stack.length - 1];
  }

  private getPositionByIndex(i: number): number[] {
    return this.positions.stack[i];
  }

  private popHead(): void {
    this.diagram[this.getHead()[0]][this.getHead()[1]].STACK.pop();
  }

  private pushHead(): void {
    this.diagram[this.getHead()[0]][this.getHead()[1]].STACK.push('H');
  }

  private checkTailTouchingHead() {
    for (let j = this.positions.stack.length - 1; j > 0; j--) {
    if (Math.abs(this.getPositionByIndex(j-1)[0] - this.getPositionByIndex(j)[0]) > 1) { // VERT
      // console.log('TAIL NEEDS TO MOVE VERT !!!!');
      const item = this.diagram[this.getPositionByIndex(j-1)[0]][this.getPositionByIndex(j-1)[1]].STACK.pop();
      if (this.getPositionByIndex(j-1)[1] !== this.getPositionByIndex(j)[1]) {
        this.getPositionByIndex(j-1)[1] < this.getPositionByIndex(j)[1] ? this.getPositionByIndex(j-1)[1] += 1 : this.getPositionByIndex(j-1)[1] -= 1;
      }
      this.getPositionByIndex(j-1)[0] < this.getPositionByIndex(j)[0] ? this.getPositionByIndex(j-1)[0] += 1 : this.getPositionByIndex(j-1)[0] -= 1;
      this.diagram[this.getPositionByIndex(j-1)[0]][this.getPositionByIndex(j-1)[1]].STACK.push(item);
      if (item === 'T' || item === '9') {
        this.diagram[this.getPositionByIndex(j-1)[0]][this.getPositionByIndex(j-1)[1]].tailWasHere = true;
      }
    }
    if (Math.abs(this.getPositionByIndex(j-1)[1] - this.getPositionByIndex(j)[1]) > 1) { // HORIZ
      // console.log('TAIL NEEDS TO MOVE HORIZ !!!!');
      const item2 = this.diagram[this.getPositionByIndex(j-1)[0]][this.getPositionByIndex(j-1)[1]].STACK.pop();
      if (this.getPositionByIndex(j-1)[0] !== this.getPositionByIndex(j)[0]) {
        this.getPositionByIndex(j-1)[0] < this.getPositionByIndex(j)[0] ? this.getPositionByIndex(j-1)[0] += 1 : this.getPositionByIndex(j-1)[0] -= 1;
      }
      this.getPositionByIndex(j-1)[1] < this.getPositionByIndex(j)[1] ? this.getPositionByIndex(j-1)[1] += 1 : this.getPositionByIndex(j-1)[1] -= 1;
      this.diagram[this.getPositionByIndex(j-1)[0]][this.getPositionByIndex(j-1)[1]].STACK.push(item2);
      if (item2 === 'T' || item2 === '9') {
        this.diagram[this.getPositionByIndex(j - 1)[0]][this.getPositionByIndex(j - 1)[1]].tailWasHere = true;
      }
    }
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
  public STACK: string[] = []; // STACK
  public s = false; // start
  public tailWasHere = false;

  constructor(STACK: string[] = [], s: boolean) {
    this.STACK = STACK;
    this.s = s;
  }

  public toString():string {
    // return this.STACK.length ? this.STACK[this.STACK.length - 1] : this.s ? 's' : '.';
    return this.tailWasHere ? '#' : this.STACK.length ? this.STACK[this.STACK.length - 1] : this.s ? 's' : '.';
  }
}
