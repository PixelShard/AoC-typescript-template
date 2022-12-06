import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  private buffer: string;

  public solveFirst(): string {
    // WRITE SOLUTION FOR TEST 1
    const i = 4;
    this.buffer = this.input.substring(0, i);
    this.loop(i, i);
    return this.buffer.length.toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '1816';
  }

  public solveSecond(): string {
    // WRITE SOLUTION FOR TEST 2
    this.buffer = '';
    const i = 14;
    this.buffer = this.input.substring(0, i);
    this.loop(i, i);
    return this.buffer.length.toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '2625';
  }

  private loop(i: number, packetSize: number): void {
    if (this.hasRepeatedCharacters(packetSize) && this.buffer.length < this.input.length) {
      this.buffer = this.input.substring(0, i);
      this.setBuffer(++i);
      this.loop(i, packetSize);
    }
  }

  private setBuffer(i: number) {
    this.buffer = this.input.substring(0, i);
  }

  private hasRepeatedCharacters = (packetSize: number): boolean => {
    return new Set(this.buffer.substring(this.buffer.length - packetSize)).size < this.buffer.substring(this.buffer.length - packetSize).length;
  };
}
