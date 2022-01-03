export const queries = {
  SIGN_UP: `INSERT INTO person (name, document, email, password, admin) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
  GET_USER_INFO: `SELECT id_person, name, document, email, password FROM person WHERE id_person = $1;`,
  GET_USER: `SELECT id_person, name, document, email, admin FROM person WHERE document = $1 AND email = $2;`,
  GET_PASSWORD: `SELECT password FROM person WHERE email = $1;`,
  CHECK_USER: `SELECT email, document FROM person WHERE email = $1 AND document = $2;`,
  CHECK_USER_EMAIL: `SELECT email FROM person WHERE email = $1;`,
  UPDATE_USER: `UPDATE person SET name = $1, email = $2 WHERE id_person = $3
    RETURNING name, email;`,
  DELETE_USER: `DELETE FROM person WHERE id_person = $1;`,

  CREATE_REQUEST: `INSERT INTO request (document_type, status, description, id_person)
    VALUES ($1, $2, $3, $4) RETURNING *;`,
  GET_REQUESTS: `SELECT id_request, document_url, document_type, status, date, description
    FROM request ORDER BY date;`,
  GET_INFO_REQUEST: `SELECT id_request, document_url, document_type, status, date, description
    FROM request WHERE id_request = $1;`,
  GET_REQUESTS_BY_USER: `SELECT id_request, document_url, document_type, status, date, description,
    id_person FROM request WHERE id_person = $1 ORDER BY date;`,
  GET_REQUEST_STATUS: `SELECT id_request, status FROM request WHERE id_request = $1;`,
  UPDATE_REQUEST: `UPDATE request SET description = $1 WHERE id_request = $2
    RETURNING *;`,
  DELETE_REQUEST: `DELETE FROM request WHERE id_request = $1;`,
  UPDATE_REQUEST_STATUS: `UPDATE request SET status = $1, document_url = $2 WHERE id_request = $3;`,
};
