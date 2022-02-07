import * as path from 'path';
import app from './config/express';
import routes from './routes/index.route';
import { Request, Response } from 'express';

// Router
app.use('/api', routes);

// Landing page
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(app.get('port'), app.get('host'), () => {
    console.log(`Server running at http://${app.get('host')}:${app.get('port')}`);
});

export default app;
