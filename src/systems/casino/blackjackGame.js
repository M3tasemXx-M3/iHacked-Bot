const cards = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

function drawCard() {
  return cards[Math.floor(Math.random() * cards.length)];
}

function getValue(card) {
  if (["J", "Q", "K"].includes(card)) return 10;

  if (card === "A") return 11;

  return Number(card);
}

function calculate(hand) {
  let total = hand.reduce((sum, card) => sum + getValue(card), 0);

  let aces = hand.filter((card) => card === "A").length;

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

module.exports = {
  drawCard,
  calculate,
};
