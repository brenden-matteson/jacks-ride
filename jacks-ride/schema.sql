-- users
CREATE TABLE IF NOT EXISTS users (
    creator_id      SERIAL PRIMARY KEY,
    user_id         VARCHAR(50) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    vehicle_make    TEXT,
    vehicle_model   TEXT,
    vehicle_year    INTEGER,
    vehicle_color   TEXT
);

-- rides
CREATE TABLE IF NOT EXISTS rides (
    ride_id         SERIAL PRIMARY KEY,
    title           TEXT        NOT NULL,
    body            TEXT        NOT NULL,
    ride_type       TEXT        NOT NULL,
    ride_date       DATE        NOT NULL,
    one_way_two_way TEXT        NOT NULL,
    pets            TEXT        NOT NULL,
    payment_amount  INTEGER,
    payment_type    TEXT        NOT NULL,
    departure_time  TIME        NOT NULL,
    seats_available INTEGER,
    destination     TEXT        NOT NULL,
    vehicle_make    TEXT        NOT NULL,
    vehicle_model   TEXT        NOT NULL,
    vehicle_year    INTEGER     NOT NULL,
    vehicle_color   TEXT        NOT NULL,
    creator_id      INTEGER     NOT NULL
        REFERENCES users(creator_id)
        ON DELETE CASCADE,
    date_created    TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);