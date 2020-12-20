const fs = require("fs");

fs.readFile(process.argv[2], "utf8", function (err, contents) {
  const input = contents.split("\n\n");
  const tilesMap = new Map();
  const edgesMap = new Map();
  for (let i = 0; i < input.length; ++i) {
    const rows = input[i].split('\n');
    let tile = [];
    const tileId = parseInt(rows[0].slice(0, -1).split(' ')[1], 10);
    let leftEdge = '', rightEdge = '';
    for (let y = 0; y < rows.length - 1; ++y) {
      tile[y] = rows[y + 1]
        .split('')
        .map((v, x) => {
          if (x === 0) {
            leftEdge += v;
          } else if (x === rows[y + 1].length - 1) {
            rightEdge += v;
          }

          return [x, y, v];
        });
      if (y === 0 || y === rows.length - 2) {
        const existingEdgeIds = edgesMap.get(rows[y + 1]);
        const reversedEdge = rows[y + 1].split('').reverse().join('');
        edgesMap.set(rows[y + 1], existingEdgeIds ? [...existingEdgeIds, tileId] : [tileId]);
        edgesMap.set(reversedEdge, edgesMap.has(reversedEdge) ? [...edgesMap.get(reversedEdge), tileId] : [tileId]);
      }
    }
    const reversedLeftEdge = leftEdge.split('').reverse().join('');
    const reversedRightEdge = rightEdge.split('').reverse().join('');
    edgesMap.set(leftEdge, edgesMap.has(leftEdge) ? [...edgesMap.get(leftEdge), tileId] : [tileId]);
    edgesMap.set(rightEdge, edgesMap.has(rightEdge) ? [...edgesMap.get(rightEdge), tileId] : [tileId]);
    edgesMap.set(reversedLeftEdge, edgesMap.has(reversedLeftEdge) ? [...edgesMap.get(reversedLeftEdge), tileId] : [tileId]);
    edgesMap.set(reversedRightEdge, edgesMap.has(reversedRightEdge) ? [...edgesMap.get(reversedRightEdge), tileId] : [tileId]);
    tilesMap.set(tileId, tile);
  }
  const tilesCount = new Map();
  const edgesMapArr = Array.from(edgesMap);
  for (let i = 0; i < edgesMapArr.length; ++i) {
    const edge = edgesMapArr[i];
    edge[1].length > 1 && edge[1].forEach(tileId => tilesCount.set(tileId, tilesCount.has(tileId) ? tilesCount.get(tileId) + 1 : 1));
  }

  console.log(
    Array.from(tilesCount)
      .reduce((acc, tile) => tile[1] === 4 ? acc * tile[0] : acc, 1)
  );
});
