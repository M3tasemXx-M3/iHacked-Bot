const Database = require("better-sqlite3");

const db = new Database("./data/database.sqlite");

console.log("🗄️ SQLite Connected");

module.exports = db;
