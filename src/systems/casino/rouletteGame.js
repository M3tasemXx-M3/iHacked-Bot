module.exports = (choice, bet) => {
  const roll = Math.random() * 100;

  let result;

  if (roll <= 48) result = "red";
  else if (roll <= 96) result = "black";
  else result = "green";

  let win = false;
  let reward = 0;

  if (choice === result) {
    win = true;

    reward = bet * (result === "green" ? 14 : 2);
  }

  return {
    result,
    win,
    reward,
  };
};
