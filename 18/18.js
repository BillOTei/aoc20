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
    string = string.replace(/[^\[\],\s]+/g, "\"$&\"");
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

  const calculate2 = (l, r, i, len) => {
    if (i >= len) {
      return r;
    } else if (Array.isArray(l[i])) {
      if (l[i + 1] === '+') {
        return calculate2(l, r + calculate2(l[i], 0, 0, l[i].length), i + 1, len);
      } else if (l[i + 1] === '*') {
        return calculate2(l[i], 0, 0, l[i].length) * calculate2(l.slice(i + 1, len), 0, 0, len - i - 1);
      }

      return calculate2(l[i], 0, 0, l[i].length);
    } else if (l[i] === '+') {
      if (Array.isArray(l[i + 1])) {
        return calculate2(l, r + calculate2(l[i + 1], 0, 0, l[i + 1].length), i + 2, len);
      }

      return calculate2(l, r + parseInt(l[i + 1], 10), i + 2, len);
    } else if (l[i] === '*') {
      return (r || 1) * calculate2(l.slice(i + 1, len), 0, 0, len - i - 1);
    }

    return calculate2(l, parseInt(l[i], 10), i + 1, len);
  }

  const calculatedLines = input.map(l => {
    const parsed = parse(l);

    return calculate2(parsed, 0, 0, parsed.length);
  })

  console.log(calculatedLines.reduce((acc, v) => acc + v))
});
