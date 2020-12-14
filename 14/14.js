const fs = require("fs");
const {all, create} = require('mathjs');

const config = {};
const math = create(all, config);

fs.readFile(process.argv[2], "utf8", function (err, contents) {
  const input = contents.split("\n");

  let memory = [], mask = [];
  for (let i = 0; i < input.length; ++i) {
    const instruction = input[i].split(' ');
    if (instruction[0] === 'mask') {
      const maskLen = instruction[2].length;
      mask = [];
      instruction[2]
        .split('')
        .forEach((v, i) => {
          if (v !== 'X') mask[maskLen - i - 1] = parseInt(v, 10)
        })
    } else {
      const memAddress = BigInt(instruction[0].match(/(\d+)/)[0]);
      let value = BigInt(instruction[2]);
      mask.forEach((bitReplacement, bitPos) => {
        value = bitReplacement === 1 ? value | 1n << BigInt(bitPos) : value & ~(1n << BigInt(bitPos));
      })
      memory[memAddress] = value;
    }
  }

  console.log(memory.reduce((acc, v) => acc + v, 0n));
});
