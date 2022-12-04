import Puzzle from '../../types/AbstractPuzzle';
import { StringHelper } from '../../utils/string.helper';

export default class ConcretePuzzle extends Puzzle {
  private stringHelper = new StringHelper();
  private pairs: string[];
  private fullContainingSections = 0;
  private partialOverlaps = 0;

  public solveFirst(): string {
    // WRITE SOLUTION FOR TEST 1
    this.initPuzzle();
    this.loopPairs();
    return this.fullContainingSections.toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '431';
  }

  public solveSecond(): string {
    // WRITE SOLUTION FOR TEST 2
    this.initPuzzle();
    this.loopPairs(true);
    return (this.fullContainingSections + this.partialOverlaps).toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '823';
  }
  
  private initPuzzle(): void {
    this.pairs = this.stringHelper.stringIntoArray(this.input);
    this.fullContainingSections = 0;
    this.partialOverlaps = 0;
  }

  private loopPairs(partialOverlap?: boolean) {
    this.pairs.map(pair => {
      const firstString = this.pariIntoString(this.stringHelper.stringIntoArray(pair, /,/)[0]);
      const secondString = this.pariIntoString(this.stringHelper.stringIntoArray(pair, /,/)[1]);
      // Fully overlap
      if (firstString.includes(secondString) || secondString.includes(firstString)) {
        this.fullContainingSections++;
      } else if (partialOverlap) {
          const toCheck = firstString.split('_').some(item => {
            if (secondString.includes(item)) {
              this.partialOverlaps++;
              return true;
            }
          });
      }
    });
  }

  private pariIntoString(pair: string): string {
    let string = '';
    for (let i = +pair.split('-')[0]; i <= +pair.split('-')[1]; i++) {
      string += i < +pair.split('-')[1] ? `<${i}>_` : `<${i}>`; // Prevent taking 1,2 and 12 as same numbers
    }
    return string;
  }
}
