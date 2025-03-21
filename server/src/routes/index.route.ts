import express from 'express';
import userRoutes from './user.route';

const router = express.Router();

router.get("/", (req, res) => {
    res.send("It's hitting the api!");
});

router.use('/users', userRoutes);

export default router;