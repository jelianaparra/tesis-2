import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connect } from "../database.js";

export const login = async (req, res) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    return res.status(400).json({ errors: e.array() });
  }
  await connect()
    .then((pool) => {
      pool
        .query(
          `select * from persona join usuario on persona.id_persona = usuario.id_persona where em_persona = $1 `,
          [req.body.email]
        )
        .then(async (data) => {
          if (data.rowCount === 1) {
            let valid = await bcrypt.compare(
              req.body.password,
              data.rows[0].cl_usuario
            );
            if (valid) {
              let token = jwt.sign(
                {
                  user: data.rows[0].id_usuario,
                  nombre: data.rows[0].no_usuario,
                  persona: data.rows[0].id_persona,
                  perfil: data.rows[0].id_perfil
                },
                process.env.SECRET
              );
              res.status(201).json({ id: data.rows[0].id_usuario, usero: token });
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
    console.log(e);
    return res.status(400).json({ errors: e.array() });
  }
  let hasPermiso = false;
  await usuarioPuede(req.user.perfil, "crear-usuario")
    .then((data) => {
      hasPermiso = data;
    })
    .catch((err) => console.log(err));
  if (!hasPermiso) {
    return res.status(401).json({ msg: "Usuario no autorizado" });
  }
  await connect()
    .then((pool) => {
      pool
        .query(
          `insert into persona (no_persona, ap_persona, ci_persona, em_persona) values ($1, $2, $3, $4) returning id_persona`,
          [req.body.nombre, req.body.apellido, req.body.cedula, req.body.email]
        )
        .then(async (data) => {
          let salt = await bcrypt.genSalt(10);
          let hash = await bcrypt.hash(req.body.password, salt);
          pool
            .query(
              "insert into usuario (no_usuario, cl_usuario, id_persona, id_perfil) values ($1, $2, $3, $4)",
              [req.body.nombre, hash, data.rows[0].id_persona, req.body.perfil ?? 2]
            )
            .then((user) => {
                console.log("Usuario creado.");
              res.status(201).json({ user: data });
            })
            .catch((e) => {
              console.log(e);
              res.status(500).json("Usuario no creado");
            });
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

export const update = async (req, res) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    console.log(e);
    return res.status(400).json({ errors: e.array() });
  }
  let hasPermiso = false;
  if(req.user.id_persona === req.body.id){
      hasPermiso = true;
  }else{
      await usuarioPuede(req.user.perfil, "actualizar-persona")
        .then((data) => {
          hasPermiso = data;
        })
        .catch((err) => console.log(err));
  }
  if (!hasPermiso) {
    return res.status(401).json({ msg: "Usuario no autorizado" });
  }
  if (
    req.body.nombre === undefined &&
    req.body.cedula === undefined &&
    req.body.email === undefined
  ) {
    return res.status(204).json();
  }

  let query = "update persona set ";
  if (req.body.nombre) query += ` no_persona='${req.body.nombre}',`;
  if (req.body.apellido) query += ` ap_persona='${req.body.apellido}',`;
  if (req.body.cedula) query += ` ci_persona='${req.body.cedula}',`;
  if (req.body.email) query += ` em_persona='${req.body.email}',`;
  query = query.slice(0, -1);
  query += " where id_persona=$1;";
  await connect()
    .then((pool) => {
      pool
        .query(query, [req.body.id])
        .then((data) => {
          return res.status(201).json({ msg: "Persona actualizada" });
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
