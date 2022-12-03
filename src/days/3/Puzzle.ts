import Puzzle from '../../types/AbstractPuzzle';
import { StringHelper } from '../../utils/string.helper';

export default class ConcretePuzzle extends Puzzle {
  private stringHelper = new StringHelper();
  private rucksacks: string[];
  private sum: number;

  public solveFirst(): string {
    // WRITE SOLUTION FOR TEST 1
    this.init();
    this.gameAlgorithm();
    return this.sum.toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '7742';
  }

  public solveSecond(): string {
    // WRITE SOLUTION FOR TEST 2
    this.init();
    this.gameAlgorithm2();
    return this.sum.toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '2276';
  }

  private init(): void {
    this.rucksacks = this.stringHelper.stringIntoArray(this.input);
    this.sum = 0;
  }

  private gameAlgorithm(): void {
    this.rucksacks.map(rucksack => {
      const halfs: string[] = this.stringHelper.splitString(rucksack);
      let i = 0;

      halfs[0].split('').forEach((c) => {
        if (halfs[1].indexOf(c) > -1) {
          i++;
          if (i>1) {
            return false;
          }
          this.sum += this.isUpperCase(c) ? halfs[0].charCodeAt(halfs[0].indexOf(c)) - 38 : halfs[0].charCodeAt(halfs[0].indexOf(c)) - 96;
        }
      });
    });
  }

  private gameAlgorithm2(): void {
    this.rucksacks.map((rucksack, i) => {
      let x = 0;
      if (i < this.rucksacks.length - 2 && i % 3 === 0) {
        rucksack.split('').forEach((c) => {
          if (this.rucksacks[i+1].indexOf(c) > -1 && this.rucksacks[i+2].indexOf(c) > -1) {
            x++;
            if (x>1) {
              return false;
            }
            this.sum += this.isUpperCase(c) ? this.rucksacks[i].charCodeAt(this.rucksacks[i].indexOf(c)) - 38 : this.rucksacks[i].charCodeAt(this.rucksacks[i].indexOf(c)) - 96;
          }
        });
      }
    });
  }

  private isUpperCase(letter: string): boolean {
    return letter.toUpperCase() === letter;
  }
}
