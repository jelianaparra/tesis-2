CREATE TYPE document_type AS ENUM ('CONSTANCIA', 'CERTIFICADO');

CREATE TYPE request_status AS ENUM ('PENDIENTE', 'COMPLETADA');

CREATE TABLE person (
  id_person SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR NOT NULL,
  document VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  admin BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE request (
  id_request SERIAL PRIMARY KEY NOT NULL,
  document_url VARCHAR,
  document_type document_type NOT NULL,
  status request_status NOT NULL,  
  date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  description VARCHAR NOT NULL,
  id_person INT NOT NULL,
  FOREIGN KEY (id_person) REFERENCES person (id_person) ON DELETE CASCADE
);
