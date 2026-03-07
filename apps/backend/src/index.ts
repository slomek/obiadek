import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import trelloRoutes from './routes/trello.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Obiadek API is running' });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Obiadek API is running' });
});

app.use('/api/trello', trelloRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
