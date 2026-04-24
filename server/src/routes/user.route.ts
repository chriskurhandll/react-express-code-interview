import express from 'express';
import { listUsers } from '../controllers/user.controller';

const router = express.Router();

router.get('/', listUsers);

export default router;
