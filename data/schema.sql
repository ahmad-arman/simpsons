DROP TABLE IF EXISTS simpsons;
CREATE TABLE simpsons (
    id SERIAL PRIMARY KEY,
    character VARCHAR(255),
    quote VARCHAR(255),
    image VARCHAR(255)
);