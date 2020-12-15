const fs = require("fs");

fs.readFile(process.argv[2], "utf8", function (err, contents) {
  const input = contents.split(",").map(x => parseInt(x, 10));

  const firstLastRound = input.length;
  let firstHistory = [];
  input.forEach((x, i) => firstHistory[x] = [i + 1]);

  const unshiftRound = (history, spoken, round) => {
    if (history[spoken]) {
      history[spoken].unshift(round);
    } else {
      history[spoken] = [round];
    }

    return history;
  }

  const play = (round, history, lastSpoken) => {
    if (history[lastSpoken].length === 1) {
      return round === 2020 ? 0 : play(round + 1, unshiftRound(history, 0, round), 0);
    } else if (history[lastSpoken].length > 1) {
      const lastSpokenHist = history[lastSpoken];
      const spoken = lastSpokenHist[0] - lastSpokenHist [1];

      return round === 2020 ? spoken : play(round + 1, unshiftRound(history, spoken, round), spoken);
    }
  }

  console.log(play(firstLastRound + 1, firstHistory, input[firstLastRound - 1]));

  let history = new Map();
  input.forEach((x, i) => history.set(x, [i + 1]));
  let round = firstLastRound + 1;
  let lastSpoken = input[firstLastRound - 1];
  const limit = 30000000;
  while (true) {
    const hist = history.get(lastSpoken);
    const l = hist.length;
    if (l === 1) {
      const zeroHist = history.get(0);
      if (zeroHist) {
        history.set(0, [zeroHist[1] || zeroHist[0], round]);
      } else {
        history.set(0, [round]);
      }
      lastSpoken = 0;
    } else if (l > 1) {
      const lastSpokenHist = history.get(lastSpoken);
      lastSpoken = lastSpokenHist[1] - lastSpokenHist [0];
      const newSpokenHist = history.get(lastSpoken);
      if (newSpokenHist) {
        history.set(lastSpoken, [newSpokenHist[1] || newSpokenHist[0], round]);
      } else {
        history.set(lastSpoken, [round]);
      }
    }

    if (round === limit) {
      break;
    } else round++;
  }

  console.log(lastSpoken);
});
