const db = require("./sqlite");

const items = [
  {
    id: "bg_dark",
    name: "🌌 Dark Background",
    type: "background",
    price: 500,
    value: "dark",
  },
  {
    id: "bg_cyan",
    name: "🩵 Profile-Cyan-Theme",
    type: "background",
    price: 10000,
    value: "cyan", // القيمة البرمجية للخلفية
  },
  {
    id: "bg_flame",
    name: "🔥 Profile-Flame-Theme",
    type: "background",
    price: 10000,
    value: "flame",
  },
  {
    id: "bg_blue",
    name: "💙 Profile-Blue-Theme",
    type: "background",
    price: 10000,
    value: "blue",
  },
  {
    id: "title_master",
    name: "👑 Master Title",
    type: "title",
    price: 2000,
    value: "Master",
  },
  {
    id: "frame_gold",
    name: "🥇 Golden Frame",
    type: "frame",
    price: 5000,
    value: "gold",
  },
  {
    id: "color_red",
    name: "🔴 Red Card",
    type: "color",
    price: 1000,
    value: "#ef4444",
  },
];

for (const item of items) {
  db.prepare(
    `
    INSERT OR IGNORE INTO shop
    (id,name,type,price,value)
    VALUES(?,?,?,?,?)
    `,
  ).run(item.id, item.name, item.type, item.price, item.value);
}

console.log("🛒 Shop Loaded with Premium Themes!");
