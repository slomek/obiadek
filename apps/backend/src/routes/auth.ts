import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  const validUsername = process.env.AUTH_USERNAME;
  const validPassword = process.env.AUTH_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!validUsername || !validPassword || !jwtSecret) {
    res.status(500).json({ error: 'Auth not configured' });
    return;
  }

  if (username !== validUsername || password !== validPassword) {
    res.status(401).json({ error: 'Invalid credentials, it should be ${validUsername} and ${validPassword}' });
    return;
  }

  const token = jwt.sign({ username }, jwtSecret, { expiresIn: '30d' });
  res.json({ token });
});

export default router;
