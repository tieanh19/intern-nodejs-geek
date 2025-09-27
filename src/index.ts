import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { errorHandlingMiddleware } from './middleware/error-handler.midleware'
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

app.use(errorHandlingMiddleware);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running http://localhost:${PORT}`));
