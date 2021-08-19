import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { connect } from "../database.js";

export const login = async(req, res) => {
    const e = validationResult(req)
    if (!e.isEmpty()) {
      return res.status(400).json({ errors: e.array() });
    }
    await connect().then((pool) => {
        pool
          .query(`select * from usuario where no_usuario = $1`, [req.body.username])
          .then((data) => {
            if (data.rowCount === 1) {
              if (bcrypt.compare(req.body.password, data.rows[0].cl_usuario)) {
                let token = jwt.sign(
                  { user: data.rows[0].id, email: data.rows[0].email },
                  process.env.SECRET
                );
                res.json({ id: data.rows[0].id ,user: token });
              }else {
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
      }).catch((er) => {
        console.log(er);
        res.status(500).json({ error: "Server Error" });
      });
}