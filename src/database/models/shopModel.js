const db = require("../sqlite");

class Shop {
  static getItems() {
    return db
      .prepare(
        `
      SELECT *
      FROM shop
    `,
      )
      .all();
  }

  static getItem(itemId) {
    return db
      .prepare(
        `
      SELECT *
      FROM shop
      WHERE id = ?
    `,
      )
      .get(itemId);
  }

  static hasItem(userId, itemId) {
    const item = db
      .prepare(
        `
      SELECT *
      FROM inventory
      WHERE userId = ?
      AND itemId = ?
    `,
      )
      .get(userId, itemId);

    return !!item;
  }

  static buy(userId, itemId) {
    return db
      .prepare(
        `
      INSERT OR IGNORE INTO inventory
      (userId,itemId,purchasedAt)
      VALUES(?,?,?)
    `,
      )
      .run(userId, itemId, Date.now());
  }

  static getInventory(userId) {
    return db
      .prepare(
        `
      SELECT shop.*
      FROM inventory
      JOIN shop
      ON inventory.itemId = shop.id
      WHERE userId = ?
    `,
      )
      .all(userId);
  }
}

module.exports = Shop;
