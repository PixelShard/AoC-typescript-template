import Puzzle from '../../types/AbstractPuzzle';
import { StringHelper } from '../../utils/string.helper';

export default class ConcretePuzzle extends Puzzle {
  private stringHelper = new StringHelper();
  private fileTreeLevel = 0;
  private route: string[];
  private fileTree: any = new Dir('root');
  private currentNode: any;
  private maxSize = 100000;
  private sum = 0;
  private totalDiskSize = 70000000;
  private needSpace = 30000000;
  private spaceToBeCleared = 0;
  private filesToDelete: number[] = [];

  public solveFirst(): string {
    // WRITE SOLUTION FOR TEST 1
    this.fileTree.addDir('/');
    this.stringHelper.stringIntoArray(this.input).map((command) => {
      const commands = command.split(' ');
      if (commands[0] === '$') { // command
        switch (commands[1]) {
          case 'cd':
              if (commands[2] === '/') {
                this.fileTreeLevel = 0;
                this.route = ['/'];
                this.setWorkingDir();
              } else if (commands[2] === '..' && this.fileTreeLevel > 0) {
                this.goUp();
              } else {
                this.fileTreeLevel+=1;
                this.route.push(commands[2]);
                this.addDirIfNotExists();
              }
            break;
          case 'ls':
              this.setWorkingDir();
            break;
        }
      } else { // files
        this.setDirectoryStats(command);
      }
    });

    for (let i = 0; i < 2; i++) {
      this.goUp(); // move to root
    }
    this.spaceToBeCleared = this.needSpace - (this.totalDiskSize - this.fileTree.getDir('/').size);
    this.sumDirsUnderMaxSize(this.fileTree);
    return this.sum.toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return '1453349';
  }

  public solveSecond(): string {
    // WRITE SOLUTION FOR TEST 2
    return this.filesToDelete.sort((x, y) => x - y)[0].toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return '2948823';
  }

  private sumDirsUnderMaxSize(dir: Dir): void {
    dir.dirs.map((d: Dir) => {
      if (d.size < this.maxSize) {
        this.sum+=d.size;
      }
      // Add for second puzzle
      if (d.size >= this.spaceToBeCleared) {
        this.filesToDelete.push(d.size);
      }
      if (dir.dirs.length) {
        this.sumDirsUnderMaxSize(d);
      }
    });
  }

  private goUp() {
    this.fileTreeLevel-=1;
    this.updateDir();
    this.route.pop();
  }

  private addDirIfNotExists(): void {
    let previousNode: any = undefined;
    let currentNode: any = undefined;
    this.route.map((path, index) => {
      currentNode = previousNode ? previousNode.getDir(path) : this.fileTree.getDir(path);
      if (this.route.length -1 === index && !currentNode) {
        if (!previousNode.find((f: Dir) => f.name === path)) {
          previousNode.addDir(path);
        }
      } else if (currentNode) {
        previousNode = currentNode;
      }
    });
  }

  private setWorkingDir() {
    this.route.map((path, i) => {
      this.currentNode = i === 0 ? this.fileTree.getDir(path) : this.currentNode.getDir(path);
    });
  }

  private updateDir() {
    this.setWorkingDir();
    this.currentNode.updateSize();
  }

  private setDirectoryStats(command: string): void {
    const stats = command.split(/\s/);
    if (stats[0] !== 'dir') {
      this.currentNode.addFile(stats[1], +stats[0]);
    } else {
      this.currentNode.addDir(stats[1]);
    }
  }

}

class Dir {
  name: string;
  size = 0;
  files: File[] = [];
  dirs: Dir[] = [];

  constructor(name: string) {
    this.name = name;
  }

  addFile(name: string, size: number) {
    this.files.push(new File(name, size));
  }

  addDir(name: string) {
    this.dirs.push(new Dir(name));
  }

  updateSize(): void {
    this.size = 0;
    this.files?.map(file => {
      this.size += file.size;
    });
    this.dirs?.map(dir => {
      this.size += dir.size;
    });
  }

  removeFile(name: string,) {
    return;
  }

  setSize(size: number) {
    this.size = size;
  }

  getSize() {
    return this.size;
  }

  getDir(name: string) {
    return this.dirs.find((dir: Dir) => dir.name === name
    );
  }
}

class File {
  name: string;
  size = 0;

  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
  }

  setSize(size: number) {
    this.size = size;
  }

  getSize() {
    return this.size;
  }
}
