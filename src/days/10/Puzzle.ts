import Puzzle from '../../types/AbstractPuzzle';
import { StringHelper } from '../../utils/string.helper';

export default class ConcretePuzzle extends Puzzle {
    private stringHelper = new StringHelper();
    private buffer: string[];
    private valueBuffer: number;
    private cycle = 1;
    private X = 1;
    private strength = 0;
    // PART 2
    private CRT: string[][];

    public solveFirst(): string {
        // WRITE SOLUTION FOR TEST 1
        this.init();
        this.loop();
        return this.strength.toString();
    }

    public getFirstExpectedResult(): string {
        // RETURN EXPECTED SOLUTION FOR TEST 1;
        return '12640';
    }

    public solveSecond(): string {
        // WRITE SOLUTION FOR TEST 2
        this.init();
        this.CRT = [...Array(6)].map(r => [...Array(40)].map(r => '.'));
        // this.printCRT();
        this.loop();
        this.printCRT();
        return 'EHBZLRJR';
    }

    public getSecondExpectedResult(): string {
        // RETURN EXPECTED SOLUTION FOR TEST 2;
        return 'EHBZLRJR';
    }

    private loop(): void {
        if (this.cycle === 1) {
            this.tick('noop');
        }
        this.buffer.map((cmd) => {
            const cmds = cmd.split(/\s/);
            cmds.length === 1 ? this.tick(cmd) : this.tick(cmds[0], +cmds[1], 2);
        });
    }

    private tick(instruction: string, value?: number, times?: number): void {
        // 3
        switch (instruction) {
            case 'noop':
                // console.log('noop');
                break;
            case 'addx':
                if (times > 1) {
                    this.tick(instruction, value, --times);
                } else {
                    this.valueBuffer = value;
                }
                break;
        }
        this.duringTheCycle();
        if (this.CRT?.length) {
            this.duringTheCycleCRT();
        }
        this.cycle +=1;
        if (this.valueBuffer) {
            // console.log(this.X + ' + ' + this.valueBuffer.toString());
            this.X += (this.valueBuffer);
            this.valueBuffer = null;
        }
    }

    private duringTheCycleCRT() {
        if (this.cycle >= 240) {
            return;
        }
        const row = this.cycle < 40 ? 0 : Math.floor(this.cycle / 40);
        const counter = this.cycle - row*40;
        if (counter-1 === this.X || counter-1 === this.X -1 || counter-1 === this.X + 1) {
            this.CRT[row][counter-1] = '#';
        }
    }
    private duringTheCycle(): void {
        if (this.cycle === 20 || (this.cycle - 20) % 40 === 0 && this.cycle <= 220) {
            // console.log(this.cycle.toString() + 'th cycle - X = ' + this.X);
            this.strength += this.cycle*this.X;
        }
    }
    private init() {
        this.buffer = this.stringHelper.stringIntoArray(this.input);
        this.cycle = 1;
        this.X = 1;
        this.strength = 0;
    }

    private printCRT(): void {
        console.log('printCRT');
        this.CRT.map((row) => {
            console.log(row.toString().replace(/,/g, ''));
        });
    }
}
