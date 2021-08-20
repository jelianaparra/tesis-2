import express from 'express'
import { deleteDoc, index, show, store, update } from '../controllers/doc';
import { docValidator, showValidator, uDocValidator } from './validator';

const routes = express.Router();

routes.get('/', showValidator, index)
routes.get('/{id}', showValidator, show)
routes.post('/store', docValidator, store)
routes.update('/update', uDocValidator, update)
routes.delete('/', showValidator, deleteDoc)

export default routes;