const fs = require("fs");

fs.readFile(process.argv[2], "utf8", function (err, contents) {
  const input = contents
    .split("\n");

  function parse(string) {
    string = string.replace(/\(/g, "[");
    string = string.replace(/\)\s/g, "], ");
    string = string.replace(/\)/g, "]");
    string = string.replace(/\s+/, ", ");
    string = "[" + string + "]";
    string = string.replace(/[^\[\]\,\s]+/g, "\"$&\"");
    string = string.replace(/" /g, "\", ");

    return JSON.parse(string);
  }

  const calculate = (simpleOp, res, i, len) => {
    if (i >= len) {
      return res;
    } else if (Array.isArray(simpleOp[i])) {
      if (simpleOp[i + 1] === '+') {
        return calculate(simpleOp, res + calculate(simpleOp[i], 0, 0, simpleOp[i].length), i + 1, len);
      } else if (simpleOp[i + 1] === '*') {
        return calculate(simpleOp, (res || 1) * calculate(simpleOp[i], 0, 0, simpleOp[i].length), i + 1, len);
      }
    } else if (simpleOp[i] === '+') {
      if (Array.isArray(simpleOp[i + 1])) {
        return calculate(simpleOp, res + calculate(simpleOp[i + 1], 0, 0, simpleOp[i + 1].length), i + 2, len);
      }
      return calculate(simpleOp, res + parseInt(simpleOp[i + 1], 10), i + 2, len);
    } else if (simpleOp[i] === '*') {
      if (Array.isArray(simpleOp[i + 1])) {
        return calculate(simpleOp, (res || 1) * calculate(simpleOp[i + 1], 0, 0, simpleOp[i + 1].length), i + 2, len);
      }
      return calculate(simpleOp, (res || 1) * parseInt(simpleOp[i + 1], 10), i + 2, len);
    }

    return calculate(simpleOp, parseInt(simpleOp[i], 10), i + 1, len);
  }

  const calculatedLines = input.map(l => {
    const parsed = parse(l);

    return calculate(parsed, 0, 0, parsed.length);
  })

  console.log(calculatedLines.reduce((acc, v) => acc + v))
});
