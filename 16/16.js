const fs = require("fs");

fs.readFile(process.argv[2], "utf8", function (err, contents) {
  const input = contents
    .split("\n\n")
    .map((part, i) => {
      const p = part.split("\n");
      if (i === 0) {
        return p.map(req => req
          .split(': ')[1]
          .split(' or ')
          .map(r => r.split('-').map(x => parseInt(x, 10)))
        )
      } else {
        p.shift();

        return p.map(l => l.split(',').map(x => parseInt(x, 10)))
      }
    });

  const merge = (ranges) => {
    let result = [], last;

    ranges.forEach(function (r) {
      if (!last || r[0] > last[1])
        result.push(last = r);
      else if (r[1] > last[1])
        last[1] = r[1];
    });

    return result;
  }

  const initialRules = JSON.parse(JSON.stringify(input[0]));
  const initialRulesNb = initialRules.length;
  const [rules, ticket, nearbyTickets] = input;
  const sortedRules = merge(rules
    .reduce((acc, r) => [...acc, ...r])
    .sort((r1, r2) => r1[0] - r2[0]));
  const rulesNb = sortedRules.length;

  let invalidValues = [];
  for (let i = 0; i < nearbyTickets.length; ++i) {
    const t = nearbyTickets[i];
    for (let j = 0; j < t.length; ++j) {
      const v = t[j];
      let checks = [];
      for (let k = 0; k < rulesNb; ++k) {
        const r = sortedRules[k];
        if (v >= r[0] && v <= r[1]) {
          checks.push(true);
        }
      }
      if (!checks[0]) {
        invalidValues.push(v);
        delete nearbyTickets[i];
      }
    }
  }

  console.log(invalidValues.reduce((acc, v) => acc + v, 0));

  let oneValidTicket;
  for (let i = 0; i < nearbyTickets.length; ++i) {
    const t = nearbyTickets[i];
    if (t) {
      oneValidTicket = t;
      break;
    }
  }

  let validityRulesMap = new Map();
  for (let numberPos = 0; numberPos < oneValidTicket.length; ++numberPos) {
    validityRulesMap.set(numberPos, initialRules.map(_ => true));
    for (let i = 0; i < nearbyTickets.length; ++i) {
      const t = nearbyTickets[i];
      if (t) {
        const v = t[numberPos];
        for (let k = 0; k < initialRulesNb; ++k) {
          const [r1, r2] = initialRules[k];
          if ((v < r1[0] || v > r1[1]) && (v < r2[0] || v > r2[1])) {
            let currentValidity = validityRulesMap.get(numberPos);
            currentValidity[k] = false;
            validityRulesMap.set(numberPos, currentValidity);
          }
        }
      }
    }
  }
  // let validityArray = Array.from(validityRulesMap);
  // while (validityArray.length) {
  //   for (let k = 1; k <= initialRulesNb; ++k) {
  //     const nbPos = validityArray.find(([key, value]) => value.filter(x => x).length === k)
  //     console.log();
  //   }
  // }

  console.log(
    Array.from(validityRulesMap)
      .filter(([_, value]) => value.slice(0, 6).filter(v => !v).length === 0)
      .reduce((acc, [k, v]) => acc * k, 1)
  )
});
