const fs = require("fs");

fs.readFile(process.argv[2], "utf8", function (err, contents) {
  let adaptersMap = [];
  const adapters = [0, ...contents
    .split("\n")
    .map(x => {
      const val = parseInt(x, 10);
      adaptersMap[val] = true;

      return val;
    })]
    .sort((a, b) => a - b);
  const adaptersCount = adapters.length;

  const nextAvailableAdapter = (joltage, incr, maxIncr) => {
    if (incr > maxIncr) {
      return -666;
    } else if (adaptersMap[joltage + incr]) {
      return joltage + incr;
    } else {
      return nextAvailableAdapter(joltage, incr + 1, maxIncr);
    }
  }

  const run = (i, oneJoltCount, threeJoltsCount) => {
    if (i === adaptersCount) {
      return oneJoltCount * threeJoltsCount;
    }
    const joltage = adapters[i];
    const nextAdapterJoltage = nextAvailableAdapter(joltage, 1, 3);

    return run(
      i + 1,
      nextAdapterJoltage - joltage === 1 ? oneJoltCount + 1 : oneJoltCount,
      nextAdapterJoltage - joltage === 3 ? threeJoltsCount + 1 : threeJoltsCount
    );
  }


  console.log(run(0, 0, 1));
});
