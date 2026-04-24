import app from './config/express';
import routes from './routes/index.route';

app.use('/api', routes);

export default app;
