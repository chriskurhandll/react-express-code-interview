import express, { Request, Response } from 'express';

const router = express.Router();
const users = [{
  name: 'Jorn',
  id: 0,
}, {
  name: 'Markus',
  id: 3,
}, {
  name: 'Andrew',
  id: 2,
}, {
  name: 'Ori',
  id: 4,
}, {
  name: 'Mike',
  id: 1,
}];

router.get('/', (req: Request, res: Response) => {
  res.send(users);
});

export default router;