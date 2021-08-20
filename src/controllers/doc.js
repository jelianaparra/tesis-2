import { connect } from "../database.js"

export const show = async (req, res) => {
    const e = validationResult(req);
    if (!e.isEmpty()) {
      console.log(e);
      return res.status(400).json({ errors: e.array() });
    }
    await connect()
      .then((pool) => {
        pool
          .query(
            "select * from tipo_documento where id_solicitud=$1;",
            [
              req.body.id
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

export const store = async (req, res) => {
    const e = validationResult(req);
    if (!e.isEmpty()) {
      console.log(e);
      return res.status(400).json({ errors: e.array() });
    }
    await connect()
      .then((pool) => {
        pool
          .query(
            "insert into tipo_documento (de_tipo_doc) values ($1);",
            [
              req.body.descripcion
            ]
          )
          .then((data) => {
            return res.status(201).json({documento: 'Documento creado' });
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
    await connect()
      .then((pool) => {
        pool
          .query(
            "update tipo_documento set de_tipo_doc=$1 where id_tipo_doc=$2;",
            [
              req.body.descripcion,
              req.body.id
            ]
          )
          .then((data) => {
            return res.status(201).json({documento: 'Documento creado' });
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
    await connect()
      .then((pool) => {
        pool
          .query(
            "delete tipo_documento where id_tipo_doc=$1;",
            [
              req.body.id
            ]
          )
          .then((data) => {
              if(data.rowCount === 1){
                  return res.status(200).json({documento: 'Documento borrado' });
                }else {
                  return res.status(404).json({documento: 'Documento no encontrado' });
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