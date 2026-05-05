import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { requestLogger } from '@/infra/http/middlewares/request-logger.middleware';

const app = express();

require('dotenv').config();

app.set('port',  process.env.APP_PORT || 3001);
app.set('host',  process.env.APP_HOST || 'localhost');

app.set("trust proxy", true);
app.use(cors());
app.use(requestLogger)
app.use(bodyParser.json());



export default app;
