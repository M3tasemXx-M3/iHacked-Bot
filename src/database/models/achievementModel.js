const db = require("../sqlite");

class AchievementModel {
  static unlock(userId, achievement) {
    return db
      .prepare(
        `
            INSERT OR IGNORE INTO achievements
            (userId, achievement, unlockedAt)
            VALUES (?, ?, ?)
        `,
      )
      .run(userId, achievement, Date.now());
  }

  static getUserAchievements(userId) {
    return db
      .prepare(
        `
            SELECT *
            FROM achievements
            WHERE userId = ?
        `,
      )
      .all(userId);
  }

  static has(userId, achievement) {
    const result = db
      .prepare(
        `
            SELECT *
            FROM achievements
            WHERE userId = ?
            AND achievement = ?
        `,
      )
      .get(userId, achievement);

    return !!result;
  }
}

module.exports = AchievementModel;
