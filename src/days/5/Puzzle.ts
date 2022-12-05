import Puzzle from '../../types/AbstractPuzzle';
import {StringHelper} from '../../utils/string.helper';

export default class ConcretePuzzle extends Puzzle {
  private stringHelper = new StringHelper();
  private stacks: string[][];

  public solveFirst(): string {
    this.init();
    // WRITE SOLUTION FOR TEST 1
    this.stringHelper.stringIntoArray(this.input).map((move) => {
      const [x, y, z] = move.match(/\b(\d+)\b/g);
      for (let i = 0; i < +x; i++) {
        this.stacks[+z - 1].push(this.stacks[+y - 1].pop());
      }
    });

    return this.stacks.map((stack) => {
      return stack[stack.length-1];
    }).toString().replace(/,/g, '');
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return 'FRDSQRRCD';
  }

  public solveSecond(): string {
    this.init();
    // WRITE SOLUTION FOR TEST 2
    this.stringHelper.stringIntoArray(this.input).map((move) => {
      const [x, y, z] = move.match(/\b(\d+)\b/g);
      const stack: string[] = [];
      for (let i = 0; i < +x; i++) {
        stack.unshift(this.stacks[+y - 1].pop());
      }
      this.stacks[+z - 1] = this.stacks[+z - 1].concat(stack);
    });

    return this.stacks.map((stack) => {
      return stack[stack.length-1];
    }).toString().replace(/,/g, '');
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return 'HRFTQVWNN';
  }

  private init() {
    this.stacks = [
      ['N', 'S', 'D', 'C', 'V', 'Q', 'T'], // 1
      ['M', 'F', 'V'], // 2
      ['F', 'Q', 'W', 'D', 'P', 'N', 'H', 'M'], // 3
      ['D', 'Q', 'R', 'T', 'F'], // 4
      ['R', 'F', 'M', 'N', 'Q', 'H', 'V', 'B'], // 5
      ['C', 'F', 'G', 'N', 'P', 'W', 'Q'], // 6
      ['W', 'F', 'R', 'L', 'C', 'T'], // 7
      ['T', 'Z', 'N', 'S'], // 8
      ['M', 'S', 'D', 'J', 'R', 'Q', 'M', 'N'], // 9
    ];
  }
}
