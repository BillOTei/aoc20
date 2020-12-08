const fs = require("fs");
const {performance} = require('perf_hooks');

fs.readFile(process.argv[2], "utf8", function (err, contents) {
  const t0 = performance.now();
  const instructions = contents.split("\n");
  const lastInstructionIdx = instructions.length - 1;
  const lastInstruction = instructions[lastInstructionIdx].split(' ');
  const lastIncrement = lastInstruction[0] === 'acc' ? parseInt(lastInstruction[1], 10) : 0;

  const run1 = (acc, idx, visitedMap, currentInstructions) => {
    const instruction = currentInstructions[idx].split(' ');
    const incr = parseInt(instruction[1], 10);
    if (visitedMap[idx] || (instruction[0] === 'jmp' && incr === 0)) {
      return {res: acc, isCleanExit: false};
    } else if (idx === lastInstructionIdx) {
      return {res: acc + lastIncrement, isCleanExit: true};
    }
    visitedMap[idx] = true;
    if (instruction[0] === 'acc') {
      return run1(acc + incr, idx + 1, visitedMap, currentInstructions);
    } else if (instruction[0] === 'jmp') {
      return run1(acc, idx + incr, visitedMap, currentInstructions);
    } else {
      return run1(acc, idx + 1, visitedMap, currentInstructions);
    }
  }

  let index, len, result;
  for (index = 0, len = instructions.length; index < len; ++index) {
    let currentInstructions = [...instructions];
    const ins = currentInstructions[index].split(' ');
    if (ins[0] === 'acc') {
      continue;
    }
    ins[0] = ins[0] === 'jmp' ? 'nop' : 'jmp';
    currentInstructions[index] = ins.join(' ');
    result = run1(0, 0, [], currentInstructions);
    if (result.isCleanExit) {
      break;
    }
  }
  const t1 = performance.now();
  console.log(result, `${t1 - t0}ms`);
});
