import Puzzle from '../../types/AbstractPuzzle';
import { StringHelper } from '../../utils/string.helper';

export default class ConcretePuzzle extends Puzzle {
  private stringHelper = new StringHelper();
  private gameInput: string[][];
  private readonly scoreMap = {
    X: 1, // Rock
    Y: 2, // Paper
    Z: 3, // Scissors
    Lost: 0,
    DRAW: 3,
    WIN: 6,
  };
  private totalScore = 0;

  private readonly roundMap: Record<string, Record<string, { score: number, result: string }>> = {
    'A': { // ROCK
      'X': { score: this.scoreMap.DRAW + this.scoreMap.X, result: 'DRAW' }, // Rock
      'Y': { score: this.scoreMap.WIN + this.scoreMap.Y, result: 'WIN' }, // Paper
      'Z': { score: this.scoreMap.Lost + this.scoreMap.Z, result: 'LOST' }// Scissors
    },
    'B': { // Paper
      'X': { score: this.scoreMap.Lost + this.scoreMap.X, result: 'LOST' }, // Rock
      'Y': { score: this.scoreMap.DRAW + this.scoreMap.Y, result: 'DRAW' }, // Paper
      'Z': { score: this.scoreMap.WIN + this.scoreMap.Z, result: 'WIN' } // Scissors
    },
    'C': { // Scissors
      'X': { score: this.scoreMap.WIN + this.scoreMap.X, result: 'WIN' }, // Rock
      'Y': { score: this.scoreMap.Lost + this.scoreMap.Y, result: 'LOST' }, // Paper
      'Z': { score: this.scoreMap.DRAW + this.scoreMap.Z, result: 'DRAW' } // Scissors
    }
  };

  public solveFirst(): string {
    // this.gameInput = this.stringHelper.stringIntoArray(this.input);
    this.gameInput = this.stringHelper.stringIntoArrayGroups(this.input, /\s/);
    this.gameAlgorithm();
    return this.totalScore.toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '12535';
  }

  public solveSecond(): string {
    this.gameInput = this.stringHelper.stringIntoArrayGroups(this.input, /\s/);
    this.gameAlgorithm(true);
    // WRITE SOLUTION FOR TEST 2
    return this.totalScore.toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '15457';
  }

  private gameAlgorithm(secondStrategy?: boolean) {
    this.totalScore = 0;
    for (const game of this.gameInput) {
      this.totalScore += this.resolveRound(game, secondStrategy);
    }
  }

  private resolveRound(round: string[], secondStrategy?: boolean): number {
    if (!secondStrategy) {
      return this.roundMap[round[0]][round[1]].score;
    } else {
      const theRound = this.roundMap[round[0]];
      switch (round[1]) {
        case 'X':
          return theRound[Object.keys(theRound).find(x => theRound[x].result === 'LOST')].score;
        case 'Y':
          return theRound[Object.keys(theRound).find(x => theRound[x].result === 'DRAW')].score;
        case 'Z':
          return theRound[Object.keys(theRound).find(x => theRound[x].result === 'WIN')].score;
      }
    }
  }
}
