import express from 'express'
import { deleteDoc, show, store } from '../controllers/doc';
import { update } from '../controllers/user';
import { docValidator, showValidator, uDocValidator } from './validator';

const routes = express.Router();


routes.get('/', showValidator, show)
routes.post('/store', docValidator, store)
routes.update('/update', uDocValidator, update)
routes.delete('/', showValidator, deleteDoc)

export default routes;