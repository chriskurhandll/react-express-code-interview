import app from './config/express';
import routes from './routes/index.route';

// Router
app.use('/api', routes);

app.listen(app.get('port'), app.get('host'), () => {
    console.log(`Server running at http://${app.get('host')}:${app.get('port')}`);
});

export default app;
