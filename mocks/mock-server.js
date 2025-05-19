/**
 * Vite middleware reference:
 * https://dev.to/brense/vite-dev-server-adding-middleware-3mp5
 */
import express from 'express';

import * as users from './resources/users';

const app = express();
const mockRouter = express.Router();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/mock', mockRouter);

// ** Routes
users.loadRoutes(mockRouter);

// ** 404
mockRouter.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

export default app;
