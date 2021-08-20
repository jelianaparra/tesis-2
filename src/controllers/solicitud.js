import { connect } from "../database.js";

export const request = async (req, res) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    console.log(e);
    return res.status(400).json({ errors: e.array() });
  }
  let hasPermiso = false;
  await usuarioPuede(req.user.perfil, "solicitardocumento")
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
          "insert into solicitud (de_solicitud, st_solicitud, fe_solicitud, id_usuario, id_tipo_doc ) values ($1, $2, $3, $4, $5);",
          [
            req.body.description,
            "pendiente",
            req.body.fecha,
            req.body.usuario,
            req.body.tipo,
          ]
        )
        .then((data) => {
          return res.status(201).json({ solicitud: "solicitud creada" });
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json();
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
  await usuarioPuede(req.user.perfil, "versolicitudes")
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
          "select * from solicitud order by id;",
          [
          ]
        )
        .then((data) => {
          return res.status(200).json({ solicitud: data.rows });
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
export const show = async (req, res) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    console.log(e);
    return res.status(400).json({ errors: e.array() });
  }
  let hasPermiso = false;
  await usuarioPuede(req.user.perfil, "versolicitud")
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
          "select * from solicitud where id_solicitud=$1;",
          [
            req.params.id
          ]
        )
        .then((data) => {
          return res.status(200).json({ solicitud: data.rows[0] });
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

export const process = async (req, res) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    console.log(e);
    return res.status(400).json({ errors: e.array() });
  }
  let hasPermiso = false;
  await usuarioPuede(req.user.perfil, "aprobarsolicitud")
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
          "update solicitud set st_solicitud='aprobada' where id_solicitud=$1;",
          [
            req.body.id
          ]
        )
        .then((data) => {
          return res.status(201).json({ solicitud: "solicitud status aprobada" });
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

export const deliver = async (req, res) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    console.log(e);
    return res.status(400).json({ errors: e.array() });
  }
  let hasPermiso = false;
  await usuarioPuede(req.user.perfil, "marcaraprobada")
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
          "update solicitud set st_solicitud='entregada' where id_solicitud=$1;",
          [
            req.body.id
          ]
        )
        .then((data) => {
          return res.status(201).json({ solicitud: "solicitud entregada" });
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

export const deleteSolicitud = async (req, res) => {
  const e = validationResult(req);
  if (!e.isEmpty()) {
    console.log(e);
    return res.status(400).json({ errors: e.array() });
  }
  let hasPermiso = false;
  await usuarioPuede(req.user.perfil, "borrarsolicitud")
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
          "delete from solicitud where id_solicitud=$1;",
          [
            req.body.id
          ]
        )
        .then((data) => {
          return res.status(201).json({ solicitud: "solicitud borrada" });
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
