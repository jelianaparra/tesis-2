import { validationResult } from "express-validator";
import { connect } from "../database.js";
import { usuarioPuede } from "../routes/validator.js";

export const show = async (req, res) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    console.log(e);
    return res.status(400).json({ errors: e.array() });
  }
  let hasPermiso = false;
  await usuarioPuede(req.user.perfil, "verdocumento")
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
        .query("select * from tipo_documento where id_tipo_doc=$1;", [
          req.body.id,
        ])
        .then((data) => {
          return res.status(200).json({ documentos: data.rows[0] });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json();
        });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json();
    });
};

export const index = async (req, res) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    console.log(e);
    return res.status(400).json({ errors: e.array() });
  }
  let hasPermiso = false;
  await usuarioPuede(req.user.perfil, "verdocumentos")
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
        .query("select * from tipo_documento;", [])
        .then((data) => {
          return res.status(200).json({ documentos: data.rows });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json();
        });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json();
    });
};

export const store = async (req, res) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    console.log(e);
    return res.status(400).json({ errors: e.array() });
  }
  let hasPermiso = false;
  await usuarioPuede(req.user.perfil, "creardocumento")
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
        .query("insert into tipo_documento (de_tipo_doc) values ($1);", [
          req.body.descripcion,
        ])
        .then((data) => {
          return res.status(201).json({ documento: "Documento creado" });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json();
        });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json();
    });
};

export const update = async (req, res) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    console.log(e);
    return res.status(400).json({ errors: e.array() });
  }
  let hasPermiso = false;
  await usuarioPuede(req.user.perfil, "actualizardocumento")
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
          "update tipo_documento set de_tipo_doc=$1 where id_tipo_doc=$2;",
          [req.body.descripcion, req.body.id]
        )
        .then((data) => {
          return res.status(201).json({ documento: "Documento modificado" });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json();
        });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json();
    });
};

export const deleteDoc = async (req, res) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    console.log(e);
    return res.status(400).json({ errors: e.array() });
  }
  let hasPermiso = false;
  await usuarioPuede(req.user.perfil, "borrardocumento")
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
        .query("delete tipo_documento where id_tipo_doc=$1;", [req.body.id])
        .then((data) => {
          if (data.rowCount === 1) {
            return res.status(200).json({ documento: "Documento borrado" });
          } else {
            return res
              .status(404)
              .json({ documento: "Documento no encontrado" });
          }
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json();
        });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json();
    });
};
