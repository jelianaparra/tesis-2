import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { connect } from "../database.js";

export const login = async (req, res) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    return res.status(400).json({ errors: e.array() });
  }
  await connect()
    .then((pool) => {
      pool
        .query(`select * from persona join usuario on persona.id_persona = usuario.id_persona where em_persona = $1 `, [
          req.body.email,
        ])
        .then(async (data) => {
          if (data.rowCount === 1) {
              let valid = await bcrypt.compare(req.body.password, data.rows[0].cl_usuario);
            if (valid) {
              let token = jwt.sign(
                { user: data.rows[0].id_usuario, nombre: data.rows[0].no_usuario },
                process.env.SECRET
              );
              res.json({ id: data.rows[0].id, user: token });
            } else {
              res.status(401).json({ user: "Bad Credentials" });
            }
          } else {
            res.status(401).json({ user: "Bad Credentials" });
          }
        })
        .catch((er) => {
          console.log(er);
          res.status(500).json({ user: "Bad Credentials" });
        });
    })
    .catch((er) => {
      console.log(er);
      res.status(500).json({ error: "Server Error" });
    });
};

export const register = async (req, res) => {
    const e = validationResult(req);
    if (!e.isEmpty()) {
        console.log(e)
      return res.status(400).json({ errors: e.array() });
    }
  await connect()
    .then((pool) => {
      pool
        .query(
          `insert into persona (no_persona, ap_persona, ci_persona, em_persona) values ($1, $2, $3, $4) returning id_persona`,
          [
            req.body.nombre,
            req.body.apellido,
            req.body.cedula,
            req.body.email
          ]
        )
        .then(async (data) => {
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.password, salt)
            pool.query(
                'insert into usuario (no_usuario, cl_usuario, id_persona) values ($1, $2, $3)',
                [
                req.body.nombre,
                hash,
                data.rows[0].id_persona
                ]
            ).then(user => {
                console.log("User created.");
                res.json({ user: data });
            }).catch((e) => {
                console.log(e);
                res.status(500).json("Failed to create user");
            })
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json();
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ failed: "Server Error" });
    });
};
