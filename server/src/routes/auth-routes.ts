import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = Router();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "default_secret_key";


export const login = async (req: Request, res: Response): Promise<void> => {
 try {
  const { username, password} = req.body;

  const user = await User.findOne({where: {username} });
  if (!user) {
    res.status(401).json({error: "Incorrect username or password. Try again!"});
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(401).json({error: "Incorrect username or password. Try again!"});
    return;
  }

  const token = jwt.sign({ username: user.username}, JWT_SECRET_KEY, {expiresIn: "1h"});

  res.json({message: "Login successful!", token});
 } catch (error) {
  res.status(500).json({error: "Internal Server Error"});
 }
};

router.post('/login', login);

export default router;
