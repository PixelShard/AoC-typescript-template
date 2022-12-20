import Puzzle from '../../types/AbstractPuzzle';
import { StringHelper } from '../../utils/string.helper';
import { isArray, isNumber, sum } from 'lodash';

export default class ConcretePuzzle extends Puzzle {
    private helper = new StringHelper();
    private packets: string[][];
    private good = 0;
    private damaged = 0;
    private goodIndexes: number[] = [];

    private init() {
        this.packets = this.helper.stringIntoArrayGroups(this.input);
    }

    private loppPackets() {
        this.packets.map((packet, index) => {
            this.compare(packet, index);
        });
        console.log('good ones: ' + this.good);
        console.log('bad ones: ' + this.damaged);
        console.log('good indexies: ' + this.goodIndexes);
    }

    private loppPacketsByRows() {
        const toSort: string[] = this.packets.flat();
        toSort.unshift('[[6]]');
        toSort.unshift('[[2]]');

        for (let i = 0; i < toSort.length; i++) {
            // Last i elements are already in place
            for (let j = 0; j < (toSort.length - i - 1); j++) {
                if (!this.compare([toSort[j], toSort[j + 1]], 0)) {
                    const temp = toSort[j];
                    toSort[j] = toSort[j + 1];
                    toSort[j + 1] = temp;
                }
            }
        }

        console.log(toSort.indexOf('[[2]]') + 1);
        console.log(toSort.indexOf('[[6]]') + 1);
        // console.log(122 * 206);
        console.log(117 * 196);

        return (toSort.indexOf('[[2]]') + 1) * (toSort.indexOf('[[6]]') + 1);
    }

    private compare(packet: any, index: number): boolean {
        // console.log(packet);
        const left = JSON.parse(packet[0]);
        const right = JSON.parse(packet[1]);

        const result = this.hasItemsToCompare(left, right);
        if (result) {
            this.good += 1;
            this.goodIndexes.push(++index);
        } else {
            this.damaged += 1;
        }

        return result;
    }

    private hasItemsToCompare(left: any, right: any, restOfLeft?: any, restOfRight?: any): boolean {
        if ((left[0] || left[0] === 0) && (right[0] || right[0] === 0)) {
            // INTEGERS
            if (isNumber(left[0]) && isNumber(right[0])) {
                if (left[0] !== right[0]) {
                    return left[0] < right[0];
                } else {
                    left.shift();
                    right.shift();
                    if ((!left?.length && (right?.length || right === 0)) || (!right?.length && (left?.length || left === 0))) {
                        return this.hasItemsToCompare(left, right); // !!!!!!!
                    } else {
                        return this.hasItemsToCompare(left, right, restOfLeft, restOfRight); // !!!!!!!
                    }
                }
                // ARRAYS
            } else if (isArray(left[0]) && isArray(right[0])) {
                if ((left[0]?.length) && right[0]?.length) {
                    if ((left?.length) || (right?.length)) {
                        return this.hasItemsToCompare(left[0], right[0], left.slice(1), right.slice(1));
                    } else {
                        return this.hasItemsToCompare(left[0], right[0]);
                    }
                }
                if (!left[0]?.length && !right[0]?.length && left?.length && right?.length) {
                    return this.hasItemsToCompare(left.slice(1), right.slice(1));
                }
                return left[0].length === 0;
            } else if (isNumber(left[0]) || isNumber(right[0])) {
                isNumber(left[0]) ? left[0] = [left[0]] : right[0] = [right[0]];
                return this.hasItemsToCompare(left, right, restOfLeft, restOfRight);
            }
            // LEFT OR RIGHT SIDE[0] has no items
        } else {
            if ((restOfLeft?.length || restOfLeft === 0) && (restOfRight?.length || restOfRight === 0)) {
                return this.hasItemsToCompare(restOfLeft, restOfRight);
            }
            return left[0] === undefined || left[0] === null;
        }
    }

    public solveFirst(): string {
        this.init();
        this.loppPackets();
        // WRITE SOLUTION FOR TEST 1
        // 5236 too low
        // 5777 too high
        // 5684
        return sum(this.goodIndexes).toString();
    }

    public getFirstExpectedResult(): string {
        // RETURN EXPECTED SOLUTION FOR TEST 1;
        return '5684';
    }

    public solveSecond(): string {
        // WRITE SOLUTION FOR TEST 2
        // 25132 too high
        return this.loppPacketsByRows().toString();
    }

    public getSecondExpectedResult(): string {
        // RETURN EXPECTED SOLUTION FOR TEST 2;
        return '22932';
    }
}
