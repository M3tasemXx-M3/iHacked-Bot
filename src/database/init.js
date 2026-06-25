// src/database/init.js

const db = require("./sqlite");

module.exports = () => {
  /*
  =====================
      GAME STATS
  =====================
  */

  db.exec(`

    CREATE TABLE IF NOT EXISTS game_stats (

    

      userId TEXT PRIMARY KEY,

      coins INTEGER DEFAULT 0,

      xp INTEGER DEFAULT 0,

      level INTEGER DEFAULT 1,

      prestige INTEGER DEFAULT 0,


      gamesPlayed INTEGER DEFAULT 0,

      wins INTEGER DEFAULT 0,

      losses INTEGER DEFAULT 0,


      mathWins INTEGER DEFAULT 0,

      mathPlayed INTEGER DEFAULT 0,


      triviaWins INTEGER DEFAULT 0,

      triviaPlayed INTEGER DEFAULT 0,


      streak INTEGER DEFAULT 0,

      topStreak INTEGER DEFAULT 0,


      dailyStreak INTEGER DEFAULT 0,

      lastDaily INTEGER DEFAULT 0,

      lastWork INTEGER DEFAULT 0,

      slotsWins INTEGER DEFAULT 0,
      slotsPlayed INTEGER DEFAULT 0,
      rouletteWins INTEGER DEFAULT 0,
      roulettePlayed INTEGER DEFAULT 0,
      blackjackWins INTEGER DEFAULT 0,
      blackjackPlayed INTEGER DEFAULT 0,

      gambleProfit INTEGER DEFAULT 0,

      bank INTEGER DEFAULT 0,

      crimeSuccess INTEGER DEFAULT 0,
      crimeFails INTEGER DEFAULT 0,

      robSuccess INTEGER DEFAULT 0,
      robFails INTEGER DEFAULT 0,

      lastCrime INTEGER DEFAULT 0,
      lastRob INTEGER DEFAULT 0,

      wantedLevel INTEGER DEFAULT 0

    );

  `);

  /*
  =====================
          SHOP
  =====================
  */

  db.exec(`

    CREATE TABLE IF NOT EXISTS shop (

      id TEXT PRIMARY KEY,

      name TEXT NOT NULL,

      type TEXT NOT NULL,

      price INTEGER DEFAULT 0,

      value TEXT

    );

  `);

  /*
  =====================
       INVENTORY
  =====================
  */

  db.exec(`

    CREATE TABLE IF NOT EXISTS inventory (

      userId TEXT NOT NULL,

      itemId TEXT NOT NULL,

      purchasedAt INTEGER NOT NULL,

      PRIMARY KEY(userId,itemId)

    );

  `);

  /*
  =====================
      ACHIEVEMENTS
  =====================
  */

  db.exec(`

    CREATE TABLE IF NOT EXISTS achievements (

      userId TEXT NOT NULL,

      achievement TEXT NOT NULL,

      unlockedAt INTEGER NOT NULL,


      PRIMARY KEY(
        userId,
        achievement
      )

    );

  `);

  console.log("✅ Database tables loaded");
};
