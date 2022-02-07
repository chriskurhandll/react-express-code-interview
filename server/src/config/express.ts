import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

require('dotenv').config();

app.set('port',  process.env.APP_PORT || 3001);
app.set('host',  process.env.APP_HOST || 'localhost');

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

export default app;