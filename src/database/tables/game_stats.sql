CREATE TABLE IF NOT EXISTS game_stats (

    userId TEXT PRIMARY KEY,

    -- Economy
    coins INTEGER DEFAULT 0,

    -- Level System
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    prestige INTEGER DEFAULT 0,

    -- Global Stats
    gamesPlayed INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,

    -- Math Stats
    mathWins INTEGER DEFAULT 0,
    mathPlayed INTEGER DEFAULT 0,

    -- Trivia Stats
    triviaWins INTEGER DEFAULT 0,
    triviaPlayed INTEGER DEFAULT 0,

    -- Streak System
    streak INTEGER DEFAULT 0,
    topStreak INTEGER DEFAULT 0,

    -- Daily
    lastDaily INTEGER DEFAULT 0,
    dailyStreak INTEGER DEFAULT 0,
    --Work 
    lastWork INTEGER DEFAULT 0,

    bank INTEGER DEFAULT 0,

    slotsWins INTEGER DEFAULT 0,
    slotsPlayed INTEGER DEFAULT 0,
    rouletteWins INTEGER DEFAULT 0,
    roulettePlayed INTEGER DEFAULT 0,
    blackjackWins INTEGER DEFAULT 0,
    blackjackPlayed INTEGER DEFAULT 0,

    gambleProfit INTEGER DEFAULT 0,

    crimeSuccess INTEGER DEFAULT 0,
    crimeFails INTEGER DEFAULT 0,

    robSuccess INTEGER DEFAULT 0,
    robFails INTEGER DEFAULT 0,

    lastCrime INTEGER DEFAULT 0,
    lastRob INTEGER DEFAULT 0,

    wantedLevel INTEGER DEFAULT 0
    );