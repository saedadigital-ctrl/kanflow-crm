import { createServer } from 'http';
import express from 'express';
import path from 'path';

const app = express();

// Servir arquivos estáticos do dist/public
app.use(express.static(path.join(__dirname, '../dist/public')));

// Rota para servir index.html em todas as rotas que não são API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/public/index.html'));
});

export default app;

