export class StringHelper {
  stringIntoArray(string: string, pattern = /\r?\n/): string[] {
    return string.split(pattern);
  }

  stringIntoArrayGroups(string: string, pattern = /\r?\n/): string[][] {
    const firstDimension = this.stringIntoArray(string, pattern);
    let counter = 0;
    const grouped: string[][] = [];
    firstDimension.map((data, i) => {
      if (data?.length) {
        if (!grouped[counter]?.length) {
          grouped[counter] = [];
        }
        grouped[counter].push(data);
      }
      if (!data?.length) {
        counter++;
      }
    });
    return grouped;
  }

  sumGrouped(grouped: string[][], sort = true): number[] {
    const summedArray = grouped.map((group) => {
      return group.reduce((acc, curr) => acc + +curr, 0);
    });
    return sort ? summedArray.sort((n1, n2) => n2 - n1) : summedArray;
  }

  splitString(string: string): string[] {
    const middle = Math.floor(string.length / 2);
    return [string.substring(0, middle), string.substring(middle)];
  }
}
