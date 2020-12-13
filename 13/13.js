const fs = require("fs");
const {all, create} = require('mathjs');

const config = {};
const math = create(all, config);

fs.readFile(process.argv[2], "utf8", function (err, contents) {
  const input = contents.split("\n");
  const ts = parseInt(input[0], 10);
  const buses = input[1]
    .split(',')
    .filter(b => b !== 'x')
    .map(b => parseInt(b, 10));
  const buses2 = input[1]
    .split(',');
  let busesMap = [];
  buses2.forEach((id, i) => {
    if (id !== 'x') busesMap[i] = id;
  })

  let id = 0, closestTs = 0;
  buses.forEach(b => {
    const t = Math.ceil(ts / b) * b;
    if (closestTs === 0 || closestTs >= t) {
      id = b;
      closestTs = t;
    }
  });

  console.log((closestTs - ts) * id);

  let ts2 = 0;
  let step = parseInt(busesMap[0], 10);
  while (true) {
    let check = true;
    busesMap.forEach((id, i) => {
      if ((ts2 + i) % id !== 0) {
        check = false;
      } else {
        step = math.lcm(step, id);
      }
    })
    if (check) {
      break;
    }
    ts2 += step;
  }

  console.log(ts2);
});
