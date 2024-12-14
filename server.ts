import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;


app.use(express.json());


const userFilePath = path.join(__dirname, 'user.json');

const readUsers = () => {
  const data = fs.readFileSync(userFilePath, 'utf-8');
  return JSON.parse(data);
};


const writeUsers = (users: any[]) => {
  fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2), 'utf-8');
};


app.post('/users', (req: Request, res: Response) => {
  const users = readUsers();
  const newUser = req.body;


  if (!newUser.id || !newUser.name || !newUser.email) {
    return res.status(400).json({ message: 'Missing required fields (id, name, email)' });
  }

  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});

app.delete('/users/:id', (req: Request, res: Response) => {
  const users = readUsers();
  const userId = parseInt(req.params.id, 10);

  const index = users.findIndex(user => user.id === userId);
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const [removedUser] = users.splice(index, 1);
  writeUsers(users);
  res.json(removedUser);
});


app.put('/users/:id', (req: Request, res: Response) => {
  const users = readUsers();
  const userId = parseInt(req.params.id, 10);
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const updatedUser = { ...users[userIndex], ...req.body };
  users[userIndex] = updatedUser;
  writeUsers(users);
  res.json(updatedUser);
});


app.get('/users', (req: Request, res: Response) => {
  const users = readUsers();
  res.json(users);
});


const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
