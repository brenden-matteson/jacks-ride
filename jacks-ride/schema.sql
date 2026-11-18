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
    vehicle_make    TEXT,
    vehicle_model   TEXT,
    vehicle_year    INTEGER,
    vehicle_color   TEXT,
    creator_id      INTEGER     NOT NULL
        REFERENCES users(creator_id)
        ON DELETE CASCADE,
    date_created    TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- messages
CREATE TABLE IF NOT EXISTS messages (
    message_id      SERIAL PRIMARY KEY,
    conversation_id INT         NOT NULL,
    sender_id       INT         NOT NULL,
    message_text    TEXT        NOT NULL,
    sent_at         TIMESTAMP DEFAULT NOW(),
    read_at         TIMESTAMP   NULL,

    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id),
    FOREIGN KEY (sender_id) REFERENCES users(creator_id)
);

-- conversations
CREATE TABLE IF NOT EXISTS conversations (
    conversation_id SERIAL PRIMARY KEY,
    rider_id        INT         NOT NULL,
    driver_id       INT         NOT NULL,
    created_at      TIMESTAMP DEFAULT NOW(),
    last_message_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (rider_id) REFERENCES users(creator_id),
    FOREIGN KEY (driver_id) REFERENCES users(creator_id),

    UNIQUE (rider_id, driver_id)
);
