import express from 'express'
import { deliver, process, request, show } from '../controllers/solicitud';

const routes = express.Router();


routes.get('/', showValidator, show)
routes.post('/store', requestValidator, request)
routes.update('/update', uRequestValidator, )
routes.post('/process', showValidator, process)
routes.post('/deliver', showValidator, deliver)

export default routes;