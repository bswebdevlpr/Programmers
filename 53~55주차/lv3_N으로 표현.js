function solution(N, number) {
  var answer = 0;
  const MAX_ROW = 6,
    MAX_COL = 6;
  const symbols = [
    (a, b) => a + b,
    (a, b) => a - b,
    (a, b) => a * b,
    (a, b) => Math.floor(a / b),
  ];

  // row - 숫자 개수
  // col - 연산기호 개수
  const matrix = new Array(MAX_ROW)
    .fill(0)
    .map(() => new Array(MAX_COL).fill(0));
  // 기본 데이터 형태: [연산식, 결과]
  for (let row = 0; row < MAX_ROW; row++) {
    let stopFlag = false;

    for (let col = 0; col < MAX_COL; col++) {
      if (row <= col) continue;

      const nowNum = N.toString().repeat(row);
      if (col === 0) matrix[row][col] = [parseInt(nowNum)];
      else if (col === 1) {
        const results = [];

        for (let [num1, num2] of getAllCases(nowNum.length, N)) {
          for (let func of symbols) {
            const calculated = func(parseInt(num1), parseInt(num2));
            if (calculated === number) {
              answer = row;
              stopFlag = true;
              break;
            }

            if (calculated > 0) results.push(calculated);
          }
        }

        matrix[row][col] = results;
      } else {
        const results = [];
        for (let val of matrix[row - 1][col - 1]) {
          for (let func of symbols) {
            const calculated = func(val, N);
            if (calculated === number) {
              answer = row;
              stopFlag = true;
              break;
            }

            if (calculated > 0) results.push(calculated);
          }
        }

        matrix[row][col] = results;
      }
    }
    if (stopFlag) break;
  }

  // matrix.forEach((row) => {
  //   console.log(row);
  // });

  // console.log(answer);

  return answer > 8 ? -1 : answer;
}

function getAllCases(length, num) {
  const ret = [];

  for (let half = Math.floor(length / 2); half > 0; half--) {
    const rest = length - half;
    ret.push([num.toString().repeat(rest), num.toString().repeat(half)]);
  }

  return ret;
}

solution(5, 12);
