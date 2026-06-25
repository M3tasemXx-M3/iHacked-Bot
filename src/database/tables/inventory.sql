CREATE TABLE IF NOT EXISTS inventory (

    userId TEXT,

    itemId TEXT,

    purchasedAt INTEGER,

    PRIMARY KEY(userId,itemId)

);