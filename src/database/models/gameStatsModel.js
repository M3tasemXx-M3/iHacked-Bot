const db = require("../sqlite");

class GameStats {
  static create(userId) {
    return db
      .prepare(
        `         INSERT OR IGNORE INTO game_stats (userId)
        VALUES (?)
      `,
      )
      .run(userId);
  }

  static get(userId) {
    this.create(userId);

    return db
      .prepare(
        `
    SELECT *
    FROM game_stats
    WHERE userId = ?
  `,
      )
      .get(userId);
  }

  static addCoins(userId, amount) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET coins = coins + ?
    WHERE userId = ?
  `,
      )
      .run(amount, userId);
  }

  static removeCoins(userId, amount) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET coins = MAX(0, coins - ?)
    WHERE userId = ?
  `,
      )
      .run(amount, userId);
  }

  static addXP(userId, amount) {
    this.create(userId);

    const user = this.get(userId);

    let xp = user.xp + amount;
    let level = user.level;

    while (xp >= level * 100) {
      xp -= level * 100;
      level++;
    }

    return db
      .prepare(
        `
    UPDATE game_stats
    SET xp = ?, level = ?
    WHERE userId = ?
  `,
      )
      .run(xp, level, userId);
  }

  static addWin(userId) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET
      wins = wins + 1,
      gamesPlayed = gamesPlayed + 1
    WHERE userId = ?
  `,
      )
      .run(userId);
  }

  static addLoss(userId) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET
      losses = losses + 1,
      gamesPlayed = gamesPlayed + 1
    WHERE userId = ?
  `,
      )
      .run(userId);
  }

  static addTriviaWin(userId) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET
      triviaWins = triviaWins + 1,
      triviaPlayed = triviaPlayed + 1
    WHERE userId = ?
  `,
      )
      .run(userId);
  }

  static addTriviaPlayed(userId) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET triviaPlayed = triviaPlayed + 1
    WHERE userId = ?
  `,
      )
      .run(userId);
  }

  static updateDaily(userId) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET lastDaily = ?
    WHERE userId = ?
  `,
      )
      .run(Date.now(), userId);
  }

  static setStreak(userId, streak) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET streak = ?
    WHERE userId = ?
  `,
      )
      .run(streak, userId);
  }

  static getRank(userId) {
    this.create(userId);

    const result = db
      .prepare(
        `
    SELECT COUNT(*) + 1 AS rank
    FROM game_stats
    WHERE wins >
    (
      SELECT wins
      FROM game_stats
      WHERE userId = ?
    )
  `,
      )
      .get(userId);

    return result?.rank || 1;
  }

  static getTopPlayers(limit = 10) {
    return db
      .prepare(
        `         SELECT *
        FROM game_stats
        ORDER BY wins DESC
        LIMIT ?
      `,
      )
      .all(limit);
  }
  static addMathWin(userId) {
    this.create(userId);

    return db
      .prepare(
        `
        UPDATE game_stats
        SET
            mathWins = mathWins + 1,
            mathPlayed = mathPlayed + 1
        WHERE userId = ?
    `,
      )
      .run(userId);
  }

  static addMathPlayed(userId) {
    this.create(userId);

    return db
      .prepare(
        `     UPDATE game_stats
    SET mathPlayed = mathPlayed + 1
    WHERE userId = ?
  `,
      )
      .run(userId);
  }
  static incrementStreak(userId) {
    this.create(userId);

    const user = this.get(userId);

    const streak = user.streak + 1;

    const topStreak = Math.max(streak, user.topStreak || 0);

    return db
      .prepare(
        `
        UPDATE game_stats
        SET
            streak = ?,
            topStreak = ?
        WHERE userId = ?
    `,
      )
      .run(streak, topStreak, userId);
  }
  static resetStreak(userId) {
    this.create(userId);

    return db
      .prepare(
        `
        UPDATE game_stats
        SET streak = 0
        WHERE userId = ?
    `,
      )
      .run(userId);
  }

  static getTopMath(limit = 10) {
    return db
      .prepare(
        `
    SELECT *
    FROM game_stats
    ORDER BY mathWins DESC
    LIMIT ?
  `,
      )
      .all(limit);
  }
  static claimDaily(userId) {
    this.create(userId);

    const user = this.get(userId);

    const now = Date.now();

    const cooldown = 86400000;

    if (now - user.lastDaily < cooldown) {
      return false;
    }

    db.prepare(
      `

UPDATE game_stats

SET

coins = coins + 100,

xp = xp + 50,

lastDaily = ?

WHERE userId=?

`,
    ).run(
      now,

      userId,
    );

    return true;
  }
  static removeCoins(userId, amount) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET coins = coins - ?
    WHERE userId = ?
  `,
      )
      .run(amount, userId);
  }

  static checkLevelUp(userId) {
    const user = this.get(userId);

    const neededXP = user.level * 100;

    if (user.xp < neededXP) return;

    db.prepare(
      `
    UPDATE game_stats
    SET
      level = level + 1,
      xp = xp - ?
    WHERE userId = ?
  `,
    ).run(neededXP, userId);
  }
  static updateWorkCooldown(userId) {
    db.prepare(
      `
    UPDATE game_stats
    SET lastWork = ?
    WHERE userId = ?
  `,
    ).run(Date.now(), userId);
  }
  static addBank(userId, amount) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET bank = bank + ?
    WHERE userId = ?
  `,
      )
      .run(amount, userId);
  }
  static removeBank(userId, amount) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET bank = bank - ?
    WHERE userId = ?
  `,
      )
      .run(amount, userId);
  }
  static setLastCrime(userId) {
    return db
      .prepare(
        `
    UPDATE game_stats
    SET lastCrime = ?
    WHERE userId = ?
  `,
      )
      .run(Date.now(), userId);
  }
  static setLastRob(userId) {
    return db
      .prepare(
        `
    UPDATE game_stats
    SET lastRob = ?
    WHERE userId = ?
  `,
      )
      .run(Date.now(), userId);
  }
  static addCrimeSuccess(userId) {
    return db
      .prepare(
        `
    UPDATE game_stats
    SET crimeSuccess = crimeSuccess + 1
    WHERE userId = ?
  `,
      )
      .run(userId);
  }
  static addCrimeFail(userId) {
    return db
      .prepare(
        `
    UPDATE game_stats
    SET crimeFails = crimeFails + 1
    WHERE userId = ?
  `,
      )
      .run(userId);
  }
  static addRobSuccess(userId) {
    return db
      .prepare(
        `
    UPDATE game_stats
    SET robSuccess = robSuccess + 1
    WHERE userId = ?
  `,
      )
      .run(userId);
  }
  static addRobFail(userId) {
    return db
      .prepare(
        `
    UPDATE game_stats
    SET robFails = robFails + 1
    WHERE userId = ?
  `,
      )
      .run(userId);
  }
  static addSlotsWin(userId) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET slotsWins = slotsWins + 1,
        slotsPlayed = slotsPlayed + 1
    WHERE userId = ?
  `,
      )
      .run(userId);
  }
  static addSlotsPlayed(userId) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET slotsPlayed = slotsPlayed + 1
    WHERE userId = ?
  `,
      )
      .run(userId);
  }
  static addRouletteWin(userId) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET rouletteWins = rouletteWins + 1,
        roulettePlayed = roulettePlayed + 1
    WHERE userId = ?
  `,
      )
      .run(userId);
  }
  static addRoulettePlayed(userId) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET roulettePlayed = roulettePlayed + 1
    WHERE userId = ?
  `,
      )
      .run(userId);
  }
  static addBlackjackPlayed(userId) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET blackjackPlayed = blackjackPlayed + 1
    WHERE userId = ?
  `,
      )
      .run(userId);
  }
  static addBlackjackWin(userId) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET
      blackjackWins = blackjackWins + 1,
      blackjackPlayed = blackjackPlayed + 1
    WHERE userId = ?
  `,
      )
      .run(userId);
  }
  static addBlackjackLoss(userId) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET blackjackPlayed = blackjackPlayed + 1
    WHERE userId = ?
  `,
      )
      .run(userId);
  }
  static addGambleProfit(userId, amount) {
    this.create(userId);

    return db
      .prepare(
        `
    UPDATE game_stats
    SET gambleProfit = gambleProfit + ?
    WHERE userId = ?
  `,
      )
      .run(amount, userId);
  }
  static setActiveBackground(userId, backgroundId) {
    this.create(userId);

    // كود تلقائي للتأكد من وجود عمود active_bg في قاعدة البيانات لمنع الأخطاء
    try {
      db.prepare(
        "ALTER TABLE game_stats ADD COLUMN active_bg TEXT DEFAULT 'default'",
      ).run();
    } catch (e) {
      // العمود موجود بالفعل، يمكن التجاوز بأمان
    }

    return db
      .prepare(
        `
        UPDATE game_stats
        SET active_bg = ?
        WHERE userId = ?
        `,
      )
      .run(backgroundId, userId);
  }
}

module.exports = GameStats;
