import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { errorHandlingMiddleware } from './middleware/error-handler.midleware'
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import RabbitMQService from './service/utils/rabbitmq.service';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandlingMiddleware);

const PORT = process.env.PORT || 4000;

RabbitMQService.getInstance().then(() => {
  console.log('Connected to RabbitMQ');
}).catch((error) => {
  console.error('Failed to connect to RabbitMQ:', error);
});

app.listen(PORT, () => console.log(`API running http://localhost:${PORT}`));
