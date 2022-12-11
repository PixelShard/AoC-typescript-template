import Puzzle from '../../types/AbstractPuzzle';
import {StringHelper} from '../../utils/string.helper';

export default class ConcretePuzzle extends Puzzle {
    private stringHelper = new StringHelper();
    private monkeys: Monkey[];
    private roundsToCount = 20;
    private roundsToCountPart2 = 10000;
    private divideWorry: boolean;

    public solveFirst(): string {
        // WRITE SOLUTION FOR TEST 1
        this.divideWorry = true;
        this.monkeys = [];
        this.initMonkeys();
        for (let i = 0; i < this.roundsToCount; i++) {
            this.rounds();
        }
        // console.log(this.monkeys);
        return (this.monkeys[1].inspectedItems * this.monkeys[5].inspectedItems).toString();
    }

    public getFirstExpectedResult(): string {
        // RETURN EXPECTED SOLUTION FOR TEST 1;
        return '66124';
    }

    public solveSecond(): string {
        // WRITE SOLUTION FOR TEST 2
        this.divideWorry = false;
        this.monkeys = [];
        this.initMonkeys();
        for (let i = 0; i < this.roundsToCountPart2; i++) {
            this.rounds();
        }
        // console.log(this.monkeys);
        return (this.monkeys[1].inspectedItems * this.monkeys[5].inspectedItems).toString();
    }

    public getSecondExpectedResult(): string {
        // RETURN EXPECTED SOLUTION FOR TEST 2;
        return '19309892877';
    }

    private rounds() {
        this.monkeys.map((monkey) => {
            monkey.turn(this.monkeys, this.divideWorry);
        });
    }

    private initMonkeys() {
        this.stringHelper.stringIntoArrayGroups(this.input).map((monkey) => {
            this.monkeys.push(new Monkey(
                monkey[0].match(/\b(\d+)\b/g)[0], // id
                monkey[2].match(/\b(\d+)\b/g) ? +monkey[2].match(/\b(\d+)\b/g)[0] : 0, // worryLvl
                monkey[1].match(/(\d+)/g), // items
                monkey[2].match(/[+\-*/]/g)[0], // operator
                +monkey[3].match(/\b(\d+)\b/g)[0], // divider
                [monkey[4].match(/(\d+)/g)[0], monkey[5].match(/(\d+)/g)[0]], // friend
            ));
        });
    }
}

class Monkey {
    public items: string[];
    public worryIncreaseWith: number;
    public inspectedItems = 0;
    private id: string;
    private operator: string; // '+' | '-' | '*' | '/';
    private divider: number;
    private friends: string[];
    private monkeys: Monkey[];

    constructor(id: string, worryLvl: number, items: string[], operator: string, divider: number, friends: string[]) {
        this.id = id;
        this.worryIncreaseWith = worryLvl;
        this.items = items;
        this.operator = operator; // '+' | '-' | '*' | '/'
        this.divider = divider;
        this.friends = friends;
    }

    turn(monkeys: Monkey[], divide: boolean) {
        this.monkeys = monkeys;
        const tmpItem = [...this.items];
        tmpItem.map((item) => {
            this.inspect(divide);
        });
    }

    catchItem(item: string) {
        this.items.push(item);
        return;
    }

    inspect(divide: boolean) {
        const item = this.operation(+this.items[0]);
        this.test(item, divide);
    }

    operation(oldWorry: number): number {
        let newWorry;
        switch (this.operator) {
            case '+':
                newWorry = this.worryIncreaseWith > 0 ? oldWorry + this.worryIncreaseWith : oldWorry + oldWorry;
                break;
            case '-':
                newWorry = this.worryIncreaseWith > 0 ? oldWorry - this.worryIncreaseWith : oldWorry - oldWorry;
                break;
            case '*':
                newWorry = this.worryIncreaseWith > 0 ? oldWorry * this.worryIncreaseWith : oldWorry * oldWorry;
                break;
            case '/':
                newWorry = this.worryIncreaseWith > 0 ? oldWorry / this.worryIncreaseWith : oldWorry / oldWorry;
                break;
        }
        return newWorry;
    }

    test(worry: number, divide: boolean) {
        this.items.shift();
        this.inspectedItems += 1;
        if (divide) {
            worry = Math.floor(worry / 3);
        } else {
            worry = worry % 9699690;
        }
        // TRUE
        if (worry % this.divider === 0) {
            this.throwToMonkey(this.friends[0], worry);
            // console.log(this.id + ' throw ' +  worry + 'to ' + this.friends[0]);
            // FALSE
        } else {
            // console.log('throw ' +  worry + 'to ' + this.friends[1]);
            this.throwToMonkey(this.friends[1], worry);
        }
    }

    throwToMonkey(id: string, item: number): void {
        this.monkeys.find((m) => m.id === id).catchItem(item.toString());
    }
}
