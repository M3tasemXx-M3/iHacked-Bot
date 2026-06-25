const db = require("./sqlite");

module.exports = () => {
  const columns = db.prepare("PRAGMA table_info(game_stats)").all();

  const hasColumn = (name) => columns.some((c) => c.name === name);

  if (!hasColumn("xp")) {
    db.exec("ALTER TABLE game_stats ADD COLUMN xp INTEGER DEFAULT 0");
  }

  if (!hasColumn("level")) {
    db.exec("ALTER TABLE game_stats ADD COLUMN level INTEGER DEFAULT 1");
  }

  if (!hasColumn("mathWins")) {
    db.exec("ALTER TABLE game_stats ADD COLUMN mathWins INTEGER DEFAULT 0");
  }

  if (!hasColumn("mathPlayed")) {
    db.exec("ALTER TABLE game_stats ADD COLUMN mathPlayed INTEGER DEFAULT 0");
  }

  if (!hasColumn("prestige")) {
    db.exec("ALTER TABLE game_stats ADD COLUMN prestige INTEGER DEFAULT 0");
  }

  if (!hasColumn("topStreak")) {
    db.exec("ALTER TABLE game_stats ADD COLUMN topStreak INTEGER DEFAULT 0");
  }

  console.log("✅ Database migrations completed");
};
