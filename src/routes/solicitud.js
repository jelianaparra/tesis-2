import express from 'express'

const routes = express.Router();


routes.get('/', showValidator, show)
routes.post('/store', requestValidator, request)
routes.update('/update', uRequestValidator, update)
routes.post('/process', showValidator, process)
routes.post('/deliver', showValidator, delivered)

export default routes;