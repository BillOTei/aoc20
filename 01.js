const fs = require("fs")

fs.readFile(process.argv[2], "utf8", function (err, contents) {
  const expenses = contents.split("\n")
  const expLen = expenses.length
  let result, result2
  loop1:
    for (let i = 0; i < expLen - 1; i++) {
      for (let j = i + 1; j < expLen; j++) {
          if (parseInt(expenses[i], 10) + parseInt(expenses[j], 10) === 2020) {
            result = parseInt(expenses[i], 10) * parseInt(expenses[j], 10)
            break loop1
          }
        }
    }

  loop2:
    for (let i = 0; i < expLen - 1; i++) {
      for (let j = i + 1; j < expLen - 1; j++) {
        for (let k = j + 1; k < expLen - 1; k++) {
          if (parseInt(expenses[i], 10) + parseInt(expenses[j], 10) + parseInt(expenses[k], 10) === 2020) {
            result2 = parseInt(expenses[i], 10) * parseInt(expenses[j], 10) * parseInt(expenses[k], 10)
            break loop2
          }
        }
      }
    }

    console.log(result, result2)
})
