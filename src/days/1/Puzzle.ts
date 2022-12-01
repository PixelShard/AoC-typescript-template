import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  private array: string[] = [];
  private tempCalories = 0;
  private mostCalories = 0;
  private hallOfFame: number[] = [];

  public solveFirst(): string {
    this.initPuzzle();
    this.puzzleAlgorithm();
    return this.mostCalories.toString();
  }
  public solveSecond(): string {
    this.initPuzzle();
    this.puzzleAlgorithm(true);
    this.hallOfFame = this.hallOfFame.sort((n1, n2) => n2 - n1);
    return (this.hallOfFame[0] + this.hallOfFame[1] + this.hallOfFame[2]).toString();
  }

  public getFirstExpectedResult(): string {
    return '69501';
  }
  public getSecondExpectedResult(): string {
    return '202346';
  }

  private initPuzzle() {
    this.array = this.input.split(/\r?\n/);
    this.tempCalories = 0;
    this.mostCalories = 0;
    this.hallOfFame = [];
  }

  private puzzleAlgorithm(createHallOfFame?: boolean) {
    for (const row of this.array) {
      if (row?.length) {
        this.tempCalories += +row;
      } else if (this.tempCalories > this.mostCalories) {
        this.mostCalories = this.tempCalories;
        if (createHallOfFame) {
          this.hallOfFame.push(this.tempCalories);
        }
        this.tempCalories = 0;
      } else {
        if (this.tempCalories && createHallOfFame) {
          this.hallOfFame.push(this.tempCalories);
        }
        this.tempCalories = 0;
      }
    }
  }
}
