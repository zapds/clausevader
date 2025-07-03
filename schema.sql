CREATE TABLE "user" (
    id INTEGER,
    google_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    picture TEXT
);


CREATE TABLE session (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
);