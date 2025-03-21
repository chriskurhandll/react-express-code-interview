import express, { Request, Response } from 'express';

const router = express.Router();

interface User {
  name: string;
  id: number;
}

const users: User[] = [
  { name: 'Jorn', id: 0 },
  { name: 'Markus', id: 3 },
  { name: 'Andrew', id: 2 },
  { name: 'Ori', id: 4 },
  { name: 'Mike', id: 1 }
];

router.get('/', (req: Request, res: Response) => {
  const { sort } = req.query; 
  console.log(`Sort by: ${sort}`);

  let sortedUsers = [...users]; 

  if (sort) {
    const sortField = sort as string;

    if (users[0].hasOwnProperty(sortField)) {
      sortedUsers = sortedUsers.sort((a, b) => {
        if (a[sortField as keyof User] > b[sortField as keyof User]) { 
          return 1;
        } else if (a[sortField as keyof User] < b[sortField as keyof User]) { 
          return -1;
        }
        return 0;
      });
    } else {
      console.error(`Invalid sort field: ${sortField}`);
      return res.status(400).json({ error: `Invalid sort field: ${sortField}` });
    }
  }
  console.log('Sorted users:', sortedUsers);
  res.send(sortedUsers); 
});

export default router;
