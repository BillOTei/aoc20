const fs = require("fs");

fs.readFile(process.argv[2], "utf8", function (err, contents) {
  const input = contents.split("\n");

  const part1 = () => {
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

    return memory;
  }

  const generateAddressVariants = (bitString) => {
    let addressArray = [];
    const count = bitString.reduce((a, e, i) => {
      if (e === 'X') a.push(i);
      return a;
    }, []).length;
    let variants = [];
    for (let i = 0; i < Math.pow(2, count); i++) {
      variants.push(i.toString(2).padStart(count, "0"));
    }
    for (let j = 0; j < variants.length; j++) {
      let index = 0;
      let address = '';
      bitString.forEach(char => {
        if (char === 'X') {
          address += variants[j][index];
          index++;
        } else {
          address += char;
        }
      })
      addressArray.push(address);
    }

    return addressArray;
  }

  const part2 = () => {
    let memory = [], mask = [];
    for (let i = 0; i < input.length; ++i) {
      const instruction = input[i].split(' ');
      if (instruction[0] === 'mask') {
        const maskLen = instruction[2].length;
        mask = [];
        instruction[2]
          .split('')
          .forEach((v, i) => {
            if (v !== 'X') mask[maskLen - i - 1] = parseInt(v, 10);
            else mask[maskLen - i - 1] = 'X'
          })
      } else {
        let memAddress = BigInt(instruction[0].match(/(\d+)/)[0])
          .toString(2)
          .padStart(36, '0')
          .split('')
          .reverse();
        const value = BigInt(instruction[2]);
        mask.forEach((bitReplacement, bitPos) => {
          if (bitReplacement === 1 || bitReplacement === 'X') {
            memAddress[bitPos] = bitReplacement.toString();
          }
        })
        generateAddressVariants(memAddress)
          .forEach(addr => memory[addr] = value)
      }
    }

    return memory;
  }

  const mem1 = part1();
  console.log(Object.keys(mem1).reduce(function (sum, key) {
      return sum + mem1[key];
    }, 0n)
  );

  const mem2 = part2();
  console.log(Object.keys(mem2).reduce(function (sum, key) {
      return sum + mem2[key];
    }, 0n)
  );
});
