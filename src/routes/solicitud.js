import express from 'express'
import { deliver, index, process, request, show } from '../controllers/solicitud';

const routes = express.Router();


routes.get('/', index)
routes.get('/{id}', showValidator, show)
routes.post('/store', requestValidator, request)
routes.update('/update', uRequestValidator, )
routes.post('/process', showValidator, process)
routes.post('/deliver', showValidator, deliver)

export default routes;