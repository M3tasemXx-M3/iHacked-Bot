function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = function generateMath(difficulty) {
  let a, b, answer, question;

  switch (difficulty) {
    case "easy":
      a = random(1, 20);
      b = random(1, 20);

      if (Math.random() > 0.5) {
        answer = a + b;
        question = `${a} + ${b}`;
      } else {
        answer = a - b;
        question = `${a} - ${b}`;
      }

      break;

    case "medium":
      a = random(10, 100);
      b = random(10, 100);

      const mediumOps = ["+", "-", "*"];
      const op1 = mediumOps[random(0, 2)];

      switch (op1) {
        case "+":
          answer = a + b;
          break;
        case "-":
          answer = a - b;
          break;
        case "*":
          answer = a * b;
          break;
      }

      question = `${a} ${op1} ${b}`;

      break;

    case "hard":
      a = random(100, 500);
      b = random(10, 100);

      answer = a * b;
      question = `${a} × ${b}`;

      break;

    case "extreme":
      a = random(1000, 5000);
      b = random(100, 500);

      answer = a * b;
      question = `${a} × ${b}`;

      break;
  }

  return {
    question,
    answer,
  };
};
