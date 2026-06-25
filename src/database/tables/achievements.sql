CREATE TABLE IF NOT EXISTS achievements (

    userId TEXT NOT NULL,

    achievement TEXT NOT NULL,

    unlockedAt INTEGER NOT NULL,

    PRIMARY KEY(userId, achievement)

);