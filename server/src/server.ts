import app from './app';
import logger from './config/logger';

app.listen(app.get('port'), app.get('host'), () => {
  logger.info(`Server running at http://${app.get('host')}:${app.get('port')}`);
});
