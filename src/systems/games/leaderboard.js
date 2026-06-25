const db = require("../../database/sqlite");

class Leaderboard {
  static async getTop(limit = 10) {
    return db.all(
      `
            SELECT *
            FROM game_stats
            ORDER BY wins DESC
            LIMIT ?
        `,
      [limit],
    );
  }
}

module.exports = Leaderboard;
