import express from 'express'
import { deleteSolicitud, deliver, index, process, request, show, update } from '../controllers/solicitud.js';

const routes = express.Router();

routes.get('/', index)
routes.get('/:id', showValidator, show)
routes.post('/store', requestValidator, request)
routes.post('/process', showValidator, process)
routes.post('/deliver', showValidator, deliver)
routes.delete('/', showValidator, deleteSolicitud)

export default routes;